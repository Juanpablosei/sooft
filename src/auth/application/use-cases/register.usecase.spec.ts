import { RegisterUserUseCase } from './register.usecase';
import { UserRepository } from '../../domain/repositories/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt'); // Mock completo de bcrypt

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  it('should hash the password and save the user', async () => {
    const userDto: UserDto = { email: 'user@example.com', password: 'password123' };
    const hashedPassword = 'hashedPassword123';
    const savedUser = new User(userDto.email, hashedPassword);

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mock manual para bcrypt.hash
    userRepository.save.mockResolvedValue(savedUser);

    const result = await registerUserUseCase.execute(userDto);

    expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10); // Verifica que bcrypt.hash se llame con los argumentos correctos
    expect(userRepository.save).toHaveBeenCalledWith(savedUser); // Verifica que el repositorio guarde el usuario
    expect(result).toEqual(savedUser); // Verifica que el resultado sea el usuario guardado
  });

  it('should throw an error if saving the user fails', async () => {
    const userDto: UserDto = { email: 'user@example.com', password: 'password123' };
    const hashedPassword = 'hashedPassword123';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mock manual para bcrypt.hash
    userRepository.save.mockRejectedValue(new Error('Database error')); // Simula un error al guardar el usuario

    await expect(registerUserUseCase.execute(userDto)).rejects.toThrow('Database error');
    expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
    expect(userRepository.save).toHaveBeenCalled();
  });
});