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
  public readonly id: number;

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
  @Transform(({ value }) => (value ? new Date(value) : null), {
    toClassOnly: true,
  })
  public readonly created: Date;

  constructor(props: Partial<RnMCharacter>) {
    Object.assign(this, props);

    if (this.url && this.id === undefined) {
      const match = this.url.match(/\/([0-9]+)\/$/);
      if (match && match[1]) {
        this.id = parseInt(match[1], 10);
      }
    }
  }

  public static toEntity(data: any): RnMCharacter {
    return plainToInstance(RnMCharacter, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
