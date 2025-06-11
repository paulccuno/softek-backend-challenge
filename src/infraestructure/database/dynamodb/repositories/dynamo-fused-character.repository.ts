import { FusedCharacter } from 'src/domain/entites/fused-character.entity';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Pagination } from 'src/domain/entites/pagination.entity';
import { DynamoDBService } from 'src/infraestructure/database/dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DynamoFusedCharacterRepository
  implements IFusedCharacterRepository
{
  private readonly tableName: string;
  private readonly logger: Logger;

  constructor(private readonly dynamodb: DynamoDBService) {
    this.tableName = 'FusedCharacter';
    this.logger = new Logger(DynamoFusedCharacterRepository.name);
  }

  async create(fusedCharacter: FusedCharacter): Promise<FusedCharacter> {
    if (!fusedCharacter.id) fusedCharacter.id = uuidv4();

    const savedData = new FusedCharacter({
      ...fusedCharacter,
      createdAt: new Date().toISOString(),
      isActive: 'true',
    });

    await this.dynamodb.putItem(this.tableName, savedData);

    await this.dynamodb.incrementCounter(this.tableName, 1);

    return savedData;
  }

  async getAll(
    limit: number,
    pageToken?: any,
  ): Promise<Pagination<FusedCharacter>> {
    const { items, nextPageToken } =
      await this.dynamodb.queryByActiveSortedByCreatedAt(
        this.tableName,
        limit,
        pageToken,
      );

    const data = (items || [])?.map((v) => new FusedCharacter(v));

    const total = await this.dynamodb.getCounter(this.tableName);
    const totalPages = Math.ceil(total / limit);

    return new Pagination({
      data: data,
      limit,
      page: nextPageToken || 0,
      total,
      totalPages,
    });
  }

  async getById(id: string): Promise<FusedCharacter | null> {
    const result = await this.dynamodb.getItem(this.tableName, {
      id,
      isActive: 'true',
    });

    if (!result?.Item || !Object.keys(result.Item || {}).length) return null;

    return FusedCharacter.toEntity(result.Item);
  }

  async udpate(
    id: string,
    fusedCharacter: FusedCharacter,
  ): Promise<FusedCharacter> {
    const record = await this.getById(id);

    if (!record) throw new Error(`Custom with ID ${id} not found.`);

    const dataUpdated = new FusedCharacter({ ...record, ...fusedCharacter });

    await this.dynamodb.putItem(this.tableName, dataUpdated);

    return dataUpdated;
  }

  async delete(id: string): Promise<void> {
    const record = await this.getById(id);

    const dataDeleted = new FusedCharacter({ ...record, isActive: 'false' });

    await this.dynamodb.putItem(this.tableName, dataDeleted);

    await this.dynamodb.incrementCounter(this.tableName, -1);
  }
}
