import { Expose, plainToInstance, Transform } from 'class-transformer';

export class SWPlanet {
  @Expose()
  public id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly rotation_period: string;

  @Expose()
  public readonly orbital_period: string;

  @Expose()
  public readonly diameter: string;

  @Expose()
  @Transform(({ value }) => (value === 'unknown' ? null : value))
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
  @Transform(({ value }) => (value ? new Date(value) : null))
  public readonly created: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : null))
  public readonly edited: Date;

  @Expose()
  public readonly url: string;

  constructor(props: Partial<SWPlanet>) {
    Object.assign(this, props);

    this.assignId();
  }

  public static toEntity(data: any): SWPlanet {
    const entityInstance = plainToInstance(SWPlanet, data, {
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
