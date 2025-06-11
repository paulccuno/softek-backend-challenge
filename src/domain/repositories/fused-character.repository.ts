import { FusedCharacter } from '../entites/fused-character.entity';
import { Pagination } from '../entites/pagination.entity';

export abstract class IFusedCharacterRepository {
  abstract create(fusedCharacter: FusedCharacter): Promise<FusedCharacter>;

  abstract getAll(
    limit: number,
    pageToken?: string,
  ): Promise<Pagination<FusedCharacter>>;

  abstract getById(id: string): Promise<FusedCharacter | null>;

  abstract udpate(
    id: string,
    fusedCharacter: FusedCharacter,
  ): Promise<FusedCharacter>;

  abstract delete(id: string): Promise<void>;
}
