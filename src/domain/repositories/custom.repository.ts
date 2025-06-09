import { Custom } from '../entites/custom.entity';
import { Pagination } from '../entites/pagination.entity';

export abstract class ICustomRepository {
  abstract create(custom: Custom): Promise<Custom>;

  abstract getAll(page: number, limit: number): Promise<Pagination<Custom>>;

  abstract getById(id: string): Promise<Custom | null>;

  abstract udpate(id: string, Custom: Custom): Promise<Custom>;

  abstract delete(id: string): Promise<void>;
}
