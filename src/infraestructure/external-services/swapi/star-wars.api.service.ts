import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SWPeople } from 'src/domain/external-services/star-wars/entities/star-wars-people.entity';
import { SWPlanet } from 'src/domain/external-services/star-wars/entities/star-wars-planet.entity';
import { IStarWarsService } from 'src/domain/external-services/star-wars/star-wars.api.service';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';

@Injectable()
export class StarWarsApiService implements IStarWarsService {
  private readonly baseUrl: string;
  private readonly logger: Logger;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = EnvironmentConfig.SW_API_BASE_URL;
    this.logger = new Logger(StarWarsApiService.name);
  }

  async getPeople(): Promise<SWPeople[]> {
    const url = `${this.baseUrl}/people`;

    const { data } = await firstValueFrom(
      this.httpService.get<SWPeople[]>(url),
    );

    return data.map((o) => SWPeople.toEntity(o));
  }

  async getPeopleById(id: number): Promise<SWPeople | null> {
    try {
      const url = `${this.baseUrl}/people/${id}`;

      const { data } = await firstValueFrom(this.httpService.get(url));

      return SWPeople.toEntity(data);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async getPlanetByUrl(planetUrl: string): Promise<SWPlanet | null> {
    const { data } = await firstValueFrom(this.httpService.get(planetUrl));

    return SWPlanet.toEntity(data);
  }
}
