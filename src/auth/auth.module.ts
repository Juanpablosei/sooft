import { Module } from '@nestjs/common';
import { AuthController } from './insfrastructure/controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './insfrastructure/schemas/user.schema';
import { UserRepositoryMongoAdapter } from './insfrastructure/repositories/user.repository';
import { AuthenticateUserUseCase } from './application/use-cases/authenticateUserUseCase';
import { RegisterUserUseCase } from './application/use-cases/register.usecase';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './insfrastructure/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './insfrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: 'User', schema: UserSchema },
        ]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
        }),
    ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryMongoAdapter,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository) => new RegisterUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (userRepository, jwtService) =>
        new AuthenticateUserUseCase(userRepository, jwtService),
      inject: ['UserRepository', JwtService],
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}