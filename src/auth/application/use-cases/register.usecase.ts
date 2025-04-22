import { UserRepository } from '../../domain/repositories/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userDto: UserDto) {
    const { email, password } = userDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User(email, passwordHash);
    return await this.userRepository.save(newUser);
    
  }
}