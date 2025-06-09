import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RnMLocation } from 'src/domain/external-services/rick-and-morty/entities/rick-and-morty-location.entity';
import { RnMPagination } from 'src/domain/external-services/rick-and-morty/entities/rick-and-morty-pagination.entity';
import { IRickAndMortyService } from 'src/domain/external-services/rick-and-morty/rick-and-morty.api.service';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';

@Injectable()
export class RickAndMortyApiService implements IRickAndMortyService {
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = EnvironmentConfig.RICK_AND_MORTY_API_BASE_URL;
  }

  async getLocations(page: number = 1): Promise<RnMPagination<RnMLocation>> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/location?page=${page}`),
    );

    return RnMPagination.toEntity<RnMLocation>(data);
  }

  async getLocationById(id: number): Promise<RnMLocation | null> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/location/${id}`),
    );

    return RnMLocation.toEntity(data);
  }

  async getRandomLocation(): Promise<RnMLocation | null> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/location`),
    );

    const totalLocations = data.info.count;
    if (totalLocations === 0) return null;

    const randomId = Math.floor(Math.random() * totalLocations) + 1;

    return this.getLocationById(randomId);
  }
}
