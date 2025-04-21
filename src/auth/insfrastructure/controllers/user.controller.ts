import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserDto } from '../../../auth/application/dto/user.dto';
import { AuthenticateUserUseCase } from '../../../auth/application/use-cases/authenticateUserUseCase';
import { RegisterUserUseCase } from '../../../auth/application/use-cases/register.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    const user = await this.authenticateUserUseCase.execute(userDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { message: 'Login successful', user };
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    try {
      const user = await this.registerUserUseCase.execute(userDto)
      if(!user){
        return { message: 'User already exists' };
      }
      return { message: 'User registered successfully', user };
    } catch (error) {
       throw new Error('An error occurred while registering the user');
    }
  }
}