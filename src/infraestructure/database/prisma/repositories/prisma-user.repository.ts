import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/domain/entites/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(PrismaUserRepository.name);
  }

  async findByUsename(username: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { username },
    });

    return prismaUser ? User.toEntity(prismaUser) : null;
  }

  async create(user: User): Promise<User> {
    this.logger.log({ user });
    const prismaUser = user.toPersistence();

    this.logger.log({ prismaUser });

    const createdPrismaUser = await this.prisma.user.create({
      data: prismaUser,
    });

    return User.toEntity(createdPrismaUser);
  }
}
