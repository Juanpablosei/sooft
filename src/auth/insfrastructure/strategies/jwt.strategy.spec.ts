import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../auth/domain/repositories/user.repository.port';
import { UnauthorizedException } from '@nestjs/common';
import * as passportJwt from 'passport-jwt'; // Importa el módulo completo para mockear métodos específicos

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    userRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    configService.get.mockReturnValue('mockedSecret'); // Mock del JWT_SECRET

    jwtStrategy = new JwtStrategy(configService, userRepository);

    // Mock del método fromAuthHeaderAsBearerToken
    jest.spyOn(passportJwt.ExtractJwt, 'fromAuthHeaderAsBearerToken').mockReturnValue(() => 'mockedToken');
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaura los mocks después de cada prueba
  });

  it('should throw an error if JWT_SECRET is not defined', () => {
    configService.get.mockReturnValue(null); // Simula que JWT_SECRET no está definido

    expect(() => new JwtStrategy(configService, userRepository)).toThrowError(
      'JWT_SECRET is not defined in the environment variables',
    );
  });

  it('should validate a user with a valid token', async () => {
    const mockPayload = { email: 'user@example.com' };
    const mockToken = 'mockedToken';
    const mockUser = { email: 'user@example.com', password: 'hashedPassword123', token: mockToken };

    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await jwtStrategy.validate({ headers: { authorization: `Bearer ${mockToken}` } }, mockPayload);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockPayload.email);
    expect(result).toEqual({ email: mockUser.email });
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const mockPayload = { email: 'user@example.com' };
    const mockToken = 'mockedToken';

    userRepository.findByEmail.mockResolvedValue(null); // Simula que el usuario no existe

    await expect(
      jwtStrategy.validate({ headers: { authorization: `Bearer ${mockToken}` } }, mockPayload),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token does not match', async () => {
    const mockPayload = { email: 'user@example.com' };
    const mockToken = 'mockedToken';
    const mockUser = { email: 'user@example.com', password: 'hashedPassword123', token: 'differentToken' };

    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      jwtStrategy.validate({ headers: { authorization: `Bearer ${mockToken}` } }, mockPayload),
    ).rejects.toThrow(UnauthorizedException);
  });
});