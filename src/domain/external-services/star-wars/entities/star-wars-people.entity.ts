import { Expose, plainToInstance, Transform } from 'class-transformer';

export class SWPeople {
  @Expose()
  public id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  @Transform(({ value }) =>
    value === 'unknown' || isNaN(value) ? null : Number(value),
  )
  public readonly height?: number;

  @Expose()
  @Transform(({ value }) =>
    value === 'unknown' || isNaN(value) ? null : Number(value),
  )
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
  @Transform(({ value }) => (value ? new Date(value) : null))
  public readonly created: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : null))
  public readonly edited: Date;

  @Expose()
  public readonly url: string;

  constructor(props: Partial<SWPeople>) {
    Object.assign(this, props);

    this.assignId();
  }

  public static toEntity(data: any): SWPeople {
    const entityInstance = plainToInstance(SWPeople, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    entityInstance.assignId();

    return entityInstance;
  }

  private assignId() {
    if (this.url && this.id === undefined) {
      const url = this.url.split('/');

      this.id = parseInt(url[url.length - 1]);
    }
  }
}
