import { Expose, instanceToPlain, plainToInstance } from 'class-transformer';
// import { User as PrismaUser } from '@prisma/client';

export class User {
  @Expose()
  id?: string;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  roles: string[];

  @Expose({ name: 'created_by' })
  public readonly createdBy: string;

  @Expose({ name: 'updated_by' })
  public updatedBy: string;

  @Expose({ name: 'created_at' })
  public readonly createdAt: Date | string;

  @Expose({ name: 'updated_at' })
  public updatedAt: Date | string;

  @Expose({ name: 'is_active' })
  public isActive: boolean | string;

  constructor(props: Partial<User>) {
    Object.assign(this, props);
  }

  public static toEntity(data: any): User {
    const userInstance = plainToInstance(User, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    userInstance.roles = data.roles.split(',').filter(Boolean);

    return userInstance;
  }

  public toPersistence(): any {
    const prismaUserInstance = instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as any;

    prismaUserInstance.roles = this.roles?.join(',');

    return prismaUserInstance;
  }
}
