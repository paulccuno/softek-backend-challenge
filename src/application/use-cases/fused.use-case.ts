import { Injectable, Logger } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { IRickAndMortyService } from '../../domain/external-services/rick-and-morty/rick-and-morty.api.service';
import { IStarWarsService } from '../../domain/external-services/star-wars/star-wars.api.service';
import { FusedCharacter } from 'src/domain/entites/fused-character.entity';

@Injectable()
export class FusedUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly rickAndMortyService: IRickAndMortyService,
    private readonly starWarsService: IStarWarsService,
    private readonly fusedCharacterRepository: IFusedCharacterRepository,
  ) {
    this.logger = new Logger(FusedUseCase.name);
  }

  async execute() {
    const swPeople = await this.starWarsService.getPeople();

    // const swCharacter = swPeople[Math.floor(Math.random() * swTotalPeople) + 1];
    const swCharacter = await this.starWarsService.getPeopleById(
      Math.floor(Math.random() * swPeople.length) + 1,
    );

    if (!swCharacter) throw new Error(`Star Wars character not found.`);

    this.logger.log({ swCharacter });

    const swCharacterUrl = swCharacter.url.split('/');

    const swCharacterId = parseInt(swCharacterUrl[swCharacterUrl.length - 1]);

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
        starWarsCharacterId: swCharacterId,
        starWarsCharacterName: swCharacter.name,
        starWarsCharacterHeight: swCharacter.height,
        starWarsCharacterMass: swCharacter.mass,
        starWarsHomeworldName: swHomeworld.name,
        starWarsHomeworldClimate: swHomeworld.climate,
        rnMLocationName: rnMLocation.name,
        rnMLocationType: rnMLocation.type,
        rnMLocationDimension: rnMLocation.dimension,
        fusionDescription: fusionDescription,
        createdBy: 'ADMIN',
      }),
    );

    return savedFusedData;
  }
}
