import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { IRickAndMortyService } from '../../external-services/rick-and-morty/rick-and-morty.api.service';
import { IStarWarsService } from '../../external-services/star-wars/star-wars.api.service';
import { FusedCharacter } from 'src/domain/entites/fused-character.entity';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';
import { CACHE_KEY } from 'src/infraestructure/cache/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheIndexManager } from '../../../infraestructure/cache/cache-index.manager';

@Injectable()
export class GetFusedExternalApiUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly rickAndMortyService: IRickAndMortyService,
    private readonly starWarsService: IStarWarsService,
    private readonly fusedCharacterRepository: IFusedCharacterRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly cacheIndexManager: CacheIndexManager,
  ) {
    this.logger = new Logger(GetFusedExternalApiUseCase.name);
  }

  async execute(user: JwtPayload) {
    const swPeople = await this.starWarsService.getPeople();

    // const swCharacter = swPeople[Math.floor(Math.random() * swTotalPeople) + 1];
    const swCharacter = await this.starWarsService.getPeopleById(
      Math.floor(Math.random() * swPeople.length) + 1,
    );

    if (!swCharacter) throw new Error(`Star Wars character not found.`);

    this.logger.log({ swCharacter });

    const swHomeworld = await this.starWarsService.getPlanetByUrl(
      swCharacter.homeworld,
    );

    if (!swHomeworld)
      throw new Error(
        `Homeworld for StarWars character ${swCharacter.name} not found.`,
      );

    const rnMLocations = await this.rickAndMortyService.getLocations(1);

    const rnMLocation = await this.rickAndMortyService.getLocationById(
      Math.floor(Math.random() * rnMLocations.info.count) + 1,
    );

    if (!rnMLocation) throw new Error(`Rick and Morty location not found.`);

    this.logger.log({ rnMLocation });

    const fusionDescription = `${swCharacter.name} (Height: ${swCharacter.height || '-'}cm, Mass: ${swCharacter.mass || '-'}kg) from the ${swHomeworld.climate || '-'} planet ${swHomeworld.name}, has been transported to the ${rnMLocation.dimension || '-'} dimension, specifically the ${rnMLocation.type || '-'} called ${rnMLocation.name} from the Rick and Morty universe.`;

    const savedFusedData = await this.fusedCharacterRepository.create(
      new FusedCharacter({
        starWarsCharacterId: swCharacter.id,
        starWarsCharacterName: swCharacter.name,
        starWarsCharacterHeight: swCharacter.height,
        starWarsCharacterMass: swCharacter.mass,
        starWarsHomeworldName: swHomeworld.name,
        starWarsHomeworldClimate: swHomeworld.climate,
        rnMLocationName: rnMLocation.name,
        rnMLocationType: rnMLocation.type,
        rnMLocationDimension: rnMLocation.dimension,
        fusionDescription: fusionDescription,
        createdBy: user.sub,
      }),
    );

    const indexKey = `${CACHE_KEY.getHistoryExternalApi}:index`;

    await this.cacheIndexManager.invalidate(indexKey);

    return savedFusedData;
  }
}
