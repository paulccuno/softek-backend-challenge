import { Expose, plainToInstance } from 'class-transformer';

export class RnMEpisode {
  @Expose()
  public readonly id: number;

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

    if (this.url) {
      const match = this.url.match(/\/([0-9]+)\/$/);
      if (match && match[1]) {
        this.id = parseInt(match[1], 10);
      }
    }
  }

  public static toEntity(data: any): RnMEpisode {
    return plainToInstance(RnMEpisode, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
