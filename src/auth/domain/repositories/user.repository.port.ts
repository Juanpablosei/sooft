import { User } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email:string): Promise<User | null>;
  save(user: User): Promise<User| null>;
  updateToken(email: string, token: string): Promise<void>;
}