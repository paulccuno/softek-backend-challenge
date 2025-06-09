import { Expose } from 'class-transformer';

export class Pagination<T> {
  @Expose()
  public data: T[];

  @Expose()
  public readonly total: number;

  @Expose()
  public readonly page: number;

  @Expose()
  public readonly limit: number;

  @Expose()
  public readonly totalPages: number;

  constructor(props: Pagination<T>) {
    Object.assign(this, props);
  }

  public static toEntity<PrismaEntity, DomainEntity>(
    paginationData: Pagination<PrismaEntity>,
    type: (new (...args: any[]) => DomainEntity) & {
      toEntity: (entity: PrismaEntity) => DomainEntity;
    },
  ): Pagination<DomainEntity> {
    return new Pagination<DomainEntity>({
      ...paginationData,
      data: paginationData.data.map((value) => type.toEntity(value)),
    });
  }
}
