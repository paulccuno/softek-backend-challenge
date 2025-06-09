import { Expose, plainToInstance, Type } from 'class-transformer';

export class RnMPaginationInfo {
  @Expose()
  public readonly count: number;

  @Expose()
  public readonly pages: number;

  @Expose()
  public readonly next?: string;

  @Expose()
  public readonly prev?: string;
}

export class RnMPagination<T> {
  @Expose()
  @Type(() => RnMPaginationInfo)
  public readonly info: RnMPaginationInfo;

  @Expose()
  public readonly results: T[];

  constructor(props: Partial<RnMPagination<T>>) {
    Object.assign(this, props);
  }

  public static toEntity<U>(data: any): RnMPagination<U> {
    return plainToInstance(RnMPagination<U>, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
