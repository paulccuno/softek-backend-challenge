import { User } from '../entites/user.entity';

export abstract class IUserRepository {
  abstract findByUsename(username: string): Promise<User | null>;

  abstract create(user: User): Promise<User>;
}
