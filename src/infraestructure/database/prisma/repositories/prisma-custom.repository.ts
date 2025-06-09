import { Injectable, Logger } from '@nestjs/common';
import { Custom } from 'src/domain/entites/custom.entity';
import { Custom as PrismaCustom } from '@prisma/client';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { PrismaService } from '../prisma.service';
import { Pagination } from 'src/domain/entites/pagination.entity';

@Injectable()
export class PrismaCustomRepostory implements ICustomRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(PrismaCustomRepostory.name);
  }

  async create(custom: Custom): Promise<Custom> {
    const prismaData = custom.toPersistence();

    const savedCustom = await this.prisma.custom.create({
      data: prismaData,
    });

    return Custom.toEntity(savedCustom);
  }

  async getAll(page: number, limit: number): Promise<Pagination<Custom>> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [prismaCustom, total] = await this.prisma.$transaction([
      this.prisma.custom.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.custom.count(),
    ]);

    return Pagination.toEntity<PrismaCustom, Custom>(
      {
        data: prismaCustom,
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      Custom,
    );
  }

  async getById(id: string): Promise<Custom | null> {
    const custom = await this.prisma.custom.findUnique({
      where: { id },
    });

    return custom ? Custom.toEntity(custom) : null;
  }

  async udpate(id: string, custom: Custom): Promise<Custom> {
    const prismaData = custom.toPersistence();

    const updatedData = await this.prisma.custom.update({
      where: { id },
      data: prismaData,
    });

    return Custom.toEntity(updatedData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.custom.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }
}
