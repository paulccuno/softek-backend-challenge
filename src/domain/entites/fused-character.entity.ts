import { Expose, instanceToPlain, plainToInstance } from 'class-transformer';
import { FusedCharacter as PrismaFusedCharacter } from '@prisma/client';

export class FusedCharacter {
  @Expose({ name: 'id' })
  public readonly id?: string;

  // SWAPI
  @Expose({ name: 'star_wars_character_id' })
  public readonly starWarsCharacterId: number;

  @Expose({ name: 'star_wars_character_name' })
  public readonly starWarsCharacterName: string;

  @Expose({ name: 'star_wars_character_height' })
  public readonly starWarsCharacterHeight?: number;

  @Expose({ name: 'star_wars_character_mass' })
  public readonly starWarsCharacterMass?: number;

  @Expose({ name: 'star_wars_homeworld_name' })
  public readonly starWarsHomeworldName: string;

  @Expose({ name: 'star_wars_homeworld_climate' })
  public readonly starWarsHomeworldClimate?: string;

  // Rick and Morty API
  @Expose({ name: 'rnm_location_name' })
  public readonly rnMLocationName: string;

  @Expose({ name: 'rnm_location_type' })
  public readonly rnMLocationType?: string;

  @Expose({ name: 'rnm_location_dimension' })
  public readonly rnMLocationDimension?: string;

  @Expose({ name: 'fusion_description' })
  public readonly fusionDescription: string;

  @Expose({ name: 'created_by' })
  public readonly createdBy: string;

  @Expose({ name: 'updated_by' })
  public updatedBy: string;

  @Expose({ name: 'created_at' })
  public readonly createdAt: Date;

  @Expose({ name: 'updated_at' })
  public updatedAt: Date;

  @Expose({ name: 'is_active' })
  public isActive: boolean;

  constructor(props: Partial<FusedCharacter>) {
    Object.assign(this, props);
  }

  public static toEntity(data: PrismaFusedCharacter): FusedCharacter {
    return plainToInstance(FusedCharacter, data, {
      exposeUnsetFields: true,
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  public toPersistence(): PrismaFusedCharacter {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as PrismaFusedCharacter;
  }
}
