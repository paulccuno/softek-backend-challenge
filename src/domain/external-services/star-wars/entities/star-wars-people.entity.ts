import { Expose, plainToInstance, Transform } from 'class-transformer';

export class SWPeople {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : Number(value)), {
    toClassOnly: true,
  })
  public readonly height?: number;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : Number(value)), {
    toClassOnly: true,
  })
  public readonly mass?: number;

  @Expose({ name: 'hair_color' })
  public readonly hairColor: string;

  @Expose({ name: 'skin_color' })
  public readonly skinColor: string;

  @Expose({ name: 'eye_color' })
  public readonly eyeColor: string;

  @Expose({ name: 'birth_year' })
  public readonly birthYear: string;

  @Expose()
  public readonly homeworld: string;

  @Expose()
  public readonly films: string[];

  @Expose()
  public readonly species: string[];

  @Expose()
  public readonly vehicles: string[];

  @Expose()
  public readonly starships: string[];

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : null), {
    toClassOnly: true,
  })
  public readonly created: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : null), {
    toClassOnly: true,
  })
  public readonly edited: Date;

  @Expose()
  public readonly url: string;

  constructor(props: Partial<SWPeople>) {
    Object.assign(this, props);

    if (this.url && this.id === undefined) {
      const match = this.url.match(/\/([0-9]+)\/$/);
      if (match && match[1]) {
        this.id = parseInt(match[1], 10);
      }
    }
  }

  public static toEntity(data: any): SWPeople {
    return plainToInstance(SWPeople, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
