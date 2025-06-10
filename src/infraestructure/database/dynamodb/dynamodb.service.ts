import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import {
  Environment,
  EnvironmentConfig,
} from 'src/infraestructure/config/environment.config';

@Injectable()
export class DynamoDBService {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb =
      EnvironmentConfig.NODE_ENV === Environment.local
        ? new DynamoDB.DocumentClient({
            region: EnvironmentConfig.AWS_REGION,
            accessKeyId: EnvironmentConfig.AWS_ACCESS_KEY_ID,
            secretAccessKey: EnvironmentConfig.AWS_SECRET_ACCESS_KEY,
          })
        : new DynamoDB.DocumentClient();
  }

  async putItem(
    tableName: string,
    item: Record<string, any>,
  ): Promise<DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: tableName,
      Item: item,
    };
    return this.dynamoDb.put(params).promise();
  }

  async getItem(
    tableName: string,
    key: Record<string, any>,
  ): Promise<DynamoDB.DocumentClient.GetItemOutput> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: tableName,
      Key: key,
    };

    return this.dynamoDb.get(params).promise();
  }

  async scanTable(
    tableName: string,
    filters: Record<string, any> = {},
  ): Promise<DynamoDB.DocumentClient.ScanOutput> {
    const expressionParts: string[] = [];
    const expressionValues: { [key: string]: any } = {};
    const expressionNames: { [key: string]: string } = {};

    Object.entries(filters).forEach(([key, value]) => {
      const attributeKey = `#${key}`;
      const valueKey = `:${key}`;

      expressionParts.push(`${attributeKey} = ${valueKey}`);
      expressionNames[attributeKey] = key;
      expressionValues[valueKey] = value;
    });

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: tableName,
    };

    if (expressionParts.length > 0) {
      params.FilterExpression = expressionParts.join(' AND ');
      params.ExpressionAttributeNames = expressionNames;
      params.ExpressionAttributeValues = expressionValues;
    }

    return this.dynamoDb.scan(params).promise();
  }

  async scanWithPagination(
    tableName: string,
    limit: number,
    nextPageToken?: Record<string, any>,
  ) {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      IndexName: 'CreatedAtIndex',
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: nextPageToken,
      KeyConditionExpression: 'partition_key = :pk',
      ExpressionAttributeValues: {
        ':pk': 'id',
      },
    };

    const result = await this.dynamoDb.query(params).promise();

    return {
      items: result.Items,
      nextPageToken: result.LastEvaluatedKey,
    };
  }

  async removeItem(tableName: string, key: DynamoDB.DocumentClient.Key) {
    const params: DynamoDB.DocumentClient.Delete = {
      TableName: tableName,
      Key: key,
    };

    return this.dynamoDb.delete(params).promise();
  }
}
