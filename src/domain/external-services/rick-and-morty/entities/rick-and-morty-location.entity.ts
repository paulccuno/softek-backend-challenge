import { Expose, plainToInstance, Transform } from 'class-transformer';

export class RnMLocation {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : String(value)), {
    toClassOnly: true,
  })
  public readonly type: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : String(value)), {
    toClassOnly: true,
  })
  public readonly dimension: string;

  @Expose()
  public readonly residents: string[];

  @Expose()
  public readonly url: string;

  @Expose()
  public readonly created: Date;

  constructor(props: Partial<RnMLocation>) {
    Object.assign(this, props);

    if (this.url && this.id === undefined) {
      const match = this.url.match(/\/([0-9]+)\/$/);
      if (match && match[1]) {
        this.id = parseInt(match[1], 10);
      }
    }
  }

  public static toEntity(data: any): RnMLocation {
    return plainToInstance(RnMLocation, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
