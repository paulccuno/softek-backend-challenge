import { SWPeople } from './entities/star-wars-people.entity';
import { SWPlanet } from './entities/star-wars-planet.entity';

export abstract class IStarWarsService {
  abstract getPeople(): Promise<SWPeople[]>;

  abstract getPeopleById(id: number): Promise<SWPeople | null>;

  abstract getPlanetByUrl(planetUrl: string): Promise<SWPlanet | null>;
}
