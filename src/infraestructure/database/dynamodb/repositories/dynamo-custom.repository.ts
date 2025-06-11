import { Injectable, Logger } from '@nestjs/common';
import { Custom } from 'src/domain/entites/custom.entity';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { Pagination } from 'src/domain/entites/pagination.entity';
import { DynamoDBService } from 'src/infraestructure/database/dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DynamoCustomRepostory implements ICustomRepository {
  private readonly tableName: string;
  private readonly logger: Logger;

  constructor(private readonly dynamodb: DynamoDBService) {
    this.tableName = 'Custom';
    this.logger = new Logger(DynamoCustomRepostory.name);
  }

  async create(custom: Custom): Promise<Custom> {
    if (!custom.id) custom.id = uuidv4();

    const savedData = new Custom({
      ...custom,
      createdAt: new Date().toISOString(),
      isActive: 'true',
    });

    await this.dynamodb.putItem(this.tableName, savedData);

    await this.dynamodb.incrementCounter(this.tableName, 1);

    return savedData;
  }

  async getAll(limit: number, pageToken?: any): Promise<Pagination<Custom>> {
    const { items, nextPageToken } =
      await this.dynamodb.queryByActiveSortedByCreatedAt(
        this.tableName,
        limit,
        pageToken,
      );

    const data = (items || [])?.map((v) => new Custom(v));

    return new Pagination({
      data: data,
      limit,
      page: nextPageToken || 0,
      total: 0,
      totalPages: 0,
    });
  }

  async getById(id: string): Promise<Custom | null> {
    const result = await this.dynamodb.getItem(this.tableName, {
      id,
      isActive: 'true',
    });

    if (!result?.Item || !Object.keys(result.Item || {}).length) return null;

    return new Custom(result.Item);
  }

  async udpate(id: string, custom: Custom): Promise<Custom> {
    const record = await this.getById(id);

    if (!record) throw new Error(`Custom with ID ${id} not found.`);

    const dataUpdated = new Custom({ ...record, ...custom });

    await this.dynamodb.putItem(this.tableName, dataUpdated);

    return dataUpdated;
  }

  async delete(id: string): Promise<void> {
    const record = await this.getById(id);

    const dataDeleted = new Custom({ ...record, isActive: 'false' });

    await this.dynamodb.putItem(this.tableName, dataDeleted);

    await this.dynamodb.incrementCounter(this.tableName, -1);
  }
}
