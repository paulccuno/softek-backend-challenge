import { Expose, plainToInstance } from 'class-transformer';

export class RnMEpisode {
  @Expose()
  public id: number;

  @Expose()
  public readonly name: string;

  @Expose({ name: 'air_date' })
  public readonly airDate: string;

  @Expose()
  public readonly episode: string;

  @Expose()
  public readonly characters: string[];

  @Expose()
  public readonly url: string;

  @Expose()
  public readonly created: Date;

  constructor(props: Partial<RnMEpisode>) {
    Object.assign(this, props);

    this.assignId();
  }

  public static toEntity(data: any): RnMEpisode {
    const entitiyInstance = plainToInstance(RnMEpisode, data, {
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
