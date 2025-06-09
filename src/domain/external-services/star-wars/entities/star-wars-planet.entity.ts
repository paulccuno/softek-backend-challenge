import { Expose, plainToInstance, Transform } from 'class-transformer';

export class SWPlanet {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly rotation_period: string;

  @Expose()
  public readonly orbital_period: string;

  @Expose()
  public readonly diameter: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : value), {
    toClassOnly: true,
  })
  public readonly climate?: string;

  @Expose()
  public readonly gravity: string;

  @Expose()
  public readonly terrain: string;

  @Expose({ name: 'surface_water' })
  public readonly surfaceWater: string;

  @Expose()
  public readonly population: string;

  @Expose()
  public readonly residents: string[];

  @Expose()
  public readonly films: string[];

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

  constructor(props: Partial<SWPlanet>) {
    Object.assign(this, props);

    if (this.url) {
      const match = this.url.match(/\/([0-9]+)\/$/);
      if (match && match[1]) {
        this.id = parseInt(match[1], 10);
      }
    }
  }

  public static toEntity(data: any): SWPlanet {
    return plainToInstance(SWPlanet, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
