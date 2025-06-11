import { Expose, plainToInstance, Transform, Type } from 'class-transformer';

export class RnMObject {
  @Expose()
  public readonly name: string;

  @Expose()
  public readonly url: string;

  constructor(props: Partial<RnMObject>) {
    Object.assign(this, props);
  }
}

export class RnMCharacter {
  @Expose()
  public id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly status: string;

  @Expose()
  public readonly species: string;

  @Expose()
  public readonly type: string;

  @Expose()
  public readonly gender: string;

  @Expose()
  @Type(() => RnMObject)
  public readonly origin: RnMObject;

  @Expose()
  @Type(() => RnMObject)
  public readonly location: RnMObject;

  @Expose()
  public readonly image: string;

  @Expose()
  public readonly episode: string[];

  @Expose()
  public readonly url: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : null))
  public readonly created: Date;

  constructor(props: Partial<RnMCharacter>) {
    Object.assign(this, props);

    this.assignId();
  }

  public static toEntity(data: any): RnMCharacter {
    const entitiyInstance = plainToInstance(RnMCharacter, data, {
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
