import { Expose, plainToInstance, Transform } from 'class-transformer';

export class RnMLocation {
  @Expose()
  public id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : String(value)))
  public readonly type: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : String(value)))
  public readonly dimension: string;

  @Expose()
  public readonly residents: string[];

  @Expose()
  public readonly url: string;

  @Expose()
  public readonly created: Date;

  constructor(props: Partial<RnMLocation>) {
    Object.assign(this, props);

    this.assignId();
  }

  public static toEntity(data: any): RnMLocation {
    const entitiyInstance = plainToInstance(RnMLocation, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    entitiyInstance.assignId();

    return entitiyInstance;
  }

  private assignId() {
    if (this.url && this.id === undefined) {
      const url = this.url.split('/');

      this.id = parseInt(url[url.length - 1]);
    }
  }
}
