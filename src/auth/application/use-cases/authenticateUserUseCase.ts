import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userDto: UserDto): Promise<User | null> {
    const user = await this.userRepository.findByEmail(userDto);
   
    return user
  }
}