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

  async queryByIndex(
    tableName: string,
    indexName: string,
    partitionKey: { attribute: string; value: any },
    sortKey?: {
      attribute: string;
      operator: '=' | '>' | '>=' | '<' | '<=';
      value: any;
    },
    filters?: Record<string, any>,
    limit?: number,
  ): Promise<DynamoDB.DocumentClient.QueryOutput> {
    const expressionNames: Record<string, string> = {
      '#pk': partitionKey.attribute,
    };
    const expressionValues: Record<string, any> = {
      ':pk': partitionKey.value,
    };

    let keyCondition = '#pk = :pk';

    if (sortKey) {
      expressionNames['#sk'] = sortKey.attribute;
      expressionValues[':sk'] = sortKey.value;
      keyCondition += ` AND #sk ${sortKey.operator} :sk`;
    }

    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      Limit: limit,
    };

    if (filters && Object.keys(filters).length > 0) {
      const filterExpressions: string[] = [];

      for (const [key, value] of Object.entries(filters)) {
        const nameKey = `#f_${key}`;
        const valueKey = `:f_${key}`;
        expressionNames[nameKey] = key;
        expressionValues[valueKey] = value;
        filterExpressions.push(`${nameKey} = ${valueKey}`);
      }

      params.FilterExpression = filterExpressions.join(' AND ');
    }

    return this.dynamoDb.query(params).promise();
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
    indexName: string,
    limit: number,
    nextPageToken?: Record<string, any>,
  ) {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      IndexName: indexName,
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

  async queryByActiveSortedByCreatedAt(
    tableName: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<{
    items: Record<string, any>[];
    nextPageToken?: string;
  }> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      IndexName: 'ActiveByCreatedAt',
      KeyConditionExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': 'true',
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    if (nextPageToken) {
      params.ExclusiveStartKey = JSON.parse(
        Buffer.from(nextPageToken, 'base64').toString('utf8'),
      );
    }

    const result = await this.dynamoDb.query(params).promise();

    let encodedToken: string | undefined;

    if (result.LastEvaluatedKey) {
      encodedToken = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey),
      ).toString('base64');
    }

    return {
      items: result.Items || [],
      nextPageToken: encodedToken,
    };
  }

  async incrementCounter(entityName: string, amount: number) {
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: 'Counters',
      Key: { entityName },
      UpdateExpression: 'ADD #total :incr',
      ExpressionAttributeNames: {
        '#total': 'total',
      },
      ExpressionAttributeValues: {
        ':incr': amount,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    return this.dynamoDb.update(params).promise();
  }

  async getCounter(entityName: string): Promise<number> {
    const params = {
      TableName: 'Counters',
      Key: { entityName },
    };

    const result = await this.dynamoDb.get(params).promise();
    return result.Item?.total || 0;
  }

  async removeItem(tableName: string, key: DynamoDB.DocumentClient.Key) {
    const params: DynamoDB.DocumentClient.Delete = {
      TableName: tableName,
      Key: key,
    };

    return this.dynamoDb.delete(params).promise();
  }
}
