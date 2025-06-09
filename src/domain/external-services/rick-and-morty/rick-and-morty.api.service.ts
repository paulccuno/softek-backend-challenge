import { RnMLocation } from './entities/rick-and-morty-location.entity';
import { RnMPagination } from './entities/rick-and-morty-pagination.entity';

export abstract class IRickAndMortyService {
  abstract getLocations(page: number): Promise<RnMPagination<RnMLocation>>;

  abstract getLocationById(id: number): Promise<RnMLocation | null>;

  abstract getRandomLocation(): Promise<RnMLocation | null>;
}
