import { AuthenticateUserUseCase } from './authenticateUserUseCase';
import { UserRepository } from '../../domain/repositories/user.repository.port';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock completo de bcrypt
jest.mock('bcrypt');

describe('AuthenticateUserUseCase', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      updateToken: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, jwtService);
  });

  it('should return a token if credentials are valid', async () => {
    const userDto = { email: 'user@example.com', password: 'password123' };
    const user = { email: 'user@example.com', password: 'hashedPassword' };
    const token = 'mockedJwtToken';

    userRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mock manual para bcrypt.compare
    jwtService.sign.mockReturnValue(token);

    const result = await authenticateUserUseCase.execute(userDto);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(userDto.password, user.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email });
    expect(userRepository.updateToken).toHaveBeenCalledWith(user.email, token);
    expect(result).toBe(token);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const userDto = { email: 'user@example.com', password: 'password123' };

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(authenticateUserUseCase.execute(userDto)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const userDto = { email: 'user@example.com', password: 'password123' };
    const user = { email: 'user@example.com', password: 'hashedPassword' };

    userRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mock manual para bcrypt.compare

    await expect(authenticateUserUseCase.execute(userDto)).rejects.toThrow(UnauthorizedException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(userDto.password, user.password);
  });
});