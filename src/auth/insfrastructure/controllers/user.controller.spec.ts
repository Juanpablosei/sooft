import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './user.controller';
import { AuthenticateUserUseCase } from '../../../auth/application/use-cases/authenticateUserUseCase';
import { RegisterUserUseCase } from '../../../auth/application/use-cases/register.usecase';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../../../auth/application/dto/user.dto';

jest.mock('../../../auth/application/use-cases/authenticateUserUseCase');
jest.mock('../../../auth/application/use-cases/register.usecase');

describe('AuthController', () => {
  let authController: AuthController;
  let authenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase>;
  let registerUserUseCase: jest.Mocked<RegisterUserUseCase>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthenticateUserUseCase,
        RegisterUserUseCase,
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authenticateUserUseCase = module.get(AuthenticateUserUseCase);
    registerUserUseCase = module.get(RegisterUserUseCase);
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      const userDto: UserDto = { email: 'user@example.com', password: 'password123' };
      const token = 'mockedJwtToken';

      authenticateUserUseCase.execute.mockResolvedValue(token);

      const result = await authController.login(userDto);

      expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(userDto);
      expect(result).toEqual({ message: 'Login successful', token });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const userDto: UserDto = { email: 'user@example.com', password: 'wrongPassword' };

      authenticateUserUseCase.execute.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(userDto)).rejects.toThrow('Invalid credentials');
      expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(userDto);
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userDto: UserDto = { email: 'user@example.com', password: 'password123' };
      const savedUser = { email: 'user@example.com', password: 'hashedPassword' };

      registerUserUseCase.execute.mockResolvedValue(savedUser);

      const result = await authController.register(userDto);

      expect(registerUserUseCase.execute).toHaveBeenCalledWith(userDto);
      expect(result).toEqual({ message: 'User registered successfully', user: savedUser });
    });

    it('should return a message if user already exists', async () => {
      const userDto: UserDto = { email: 'user@example.com', password: 'password123' };

      registerUserUseCase.execute.mockResolvedValue(null);

      const result = await authController.register(userDto);

      expect(registerUserUseCase.execute).toHaveBeenCalledWith(userDto);
      expect(result).toEqual({ message: 'User already exists' });
    });

    it('should throw an error if registration fails', async () => {
      const userDto: UserDto = { email: 'user@example.com', password: 'password123' };

      registerUserUseCase.execute.mockRejectedValue(new Error('Database error'));

      await expect(authController.register(userDto)).rejects.toThrow('An error occurred while registering the user');
      expect(registerUserUseCase.execute).toHaveBeenCalledWith(userDto);
    });
  });
});