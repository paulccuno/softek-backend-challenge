import { FusedCharacter } from 'src/domain/entites/fused-character.entity';
import { FusedCharacter as PrismaFusedCharacter } from '@prisma/client';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pagination } from 'src/domain/entites/pagination.entity';

@Injectable()
export class PrismaFusedCharactedRepository
  implements IFusedCharacterRepository
{
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(PrismaFusedCharactedRepository.name);
  }

  async create(fusedCharacter: FusedCharacter): Promise<FusedCharacter> {
    const prismaData = fusedCharacter.toPersistence();

    const savedFusedCharacter = await this.prisma.fusedCharacter.create({
      data: prismaData,
    });

    return FusedCharacter.toEntity(savedFusedCharacter);
  }

  async getAll(
    page: number,
    limit: number,
  ): Promise<Pagination<FusedCharacter>> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [prismaFusedCharacters, total] = await this.prisma.$transaction([
      this.prisma.fusedCharacter.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.fusedCharacter.count(),
    ]);

    return Pagination.toEntity<PrismaFusedCharacter, FusedCharacter>(
      {
        data: prismaFusedCharacters,
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      FusedCharacter,
    );
  }

  async getById(id: string): Promise<FusedCharacter | null> {
    const fusedCharacter = await this.prisma.fusedCharacter.findUnique({
      where: { id },
    });

    return fusedCharacter ? FusedCharacter.toEntity(fusedCharacter) : null;
  }

  async udpate(
    id: string,
    fusedCharacter: FusedCharacter,
  ): Promise<FusedCharacter> {
    const prismaData = fusedCharacter.toPersistence();

    const updatedData = await this.prisma.fusedCharacter.update({
      where: { id },
      data: prismaData,
    });

    return FusedCharacter.toEntity(updatedData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.fusedCharacter.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }
}
