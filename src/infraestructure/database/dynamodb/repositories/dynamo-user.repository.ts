import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/domain/entites/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { DynamoDBService } from 'src/infraestructure/database/dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DynamoUserRepository implements IUserRepository {
  private readonly tableName: string;
  private readonly logger: Logger;

  constructor(private readonly dynamodb: DynamoDBService) {
    this.tableName = 'User';
    this.logger = new Logger(DynamoUserRepository.name);
  }

  async findByUsename(username: string): Promise<User | null> {
    const result = await this.dynamodb.getItem(this.tableName, {
      username,
      isActive: true,
    });

    if (!result?.Item || !Object.keys(result.Item || {}).length) return null;

    return new User(result.Item);
  }

  async create(user: User): Promise<User> {
    this.logger.log({ user });

    if (!user.id) user.id = uuidv4();

    const savedData = new User({
      ...user,
      createdAt: new Date(),
      isActive: true,
    });

    await this.dynamodb.putItem(this.tableName, savedData);

    return savedData;
  }
}
