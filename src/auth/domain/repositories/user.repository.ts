import { User } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(user:User): Promise<User | null>;
  save(user: User): Promise<User| null>;
}