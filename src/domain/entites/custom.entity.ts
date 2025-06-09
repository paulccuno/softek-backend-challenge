import { Expose, instanceToPlain, plainToInstance } from 'class-transformer';
import { Custom as PrismaCustom } from '@prisma/client';

export class Custom {
  @Expose({ name: 'id' })
  public readonly id?: string;

  @Expose({ name: 'title' })
  public title: string;

  @Expose({ name: 'content' })
  public content: string;

  @Expose({ name: 'created_by' })
  public readonly createdBy: string;

  @Expose({ name: 'updated_by' })
  public updatedBy: string;

  @Expose({ name: 'created_at' })
  public readonly createdAt: Date;

  @Expose({ name: 'updated_at' })
  public updatedAt: Date;

  @Expose({ name: 'is_active' })
  public isActive: boolean;

  constructor(props: Partial<Custom>) {
    Object.assign(this, props);
  }

  public static toEntity(data: PrismaCustom): Custom {
    return plainToInstance(Custom, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  toPersistence(): PrismaCustom {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as PrismaCustom;
  }
}
