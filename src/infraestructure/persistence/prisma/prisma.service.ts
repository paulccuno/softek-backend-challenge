import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    this.logger.log('Connecting to the database...');
    try {
      await this.$connect();
      this.logger.log('Database connection established.');
    } catch (error) {
      this.logger.error('Error connecting to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...');
    try {
      await this.$disconnect();
      this.logger.log('Database disconnection completed.');
    } catch (error) {
      this.logger.error('Error disconnecting from the database:', error);
    }
  }

  enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }
}
