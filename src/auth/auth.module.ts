import { Module } from '@nestjs/common';
import { AuthController } from './insfrastructure/controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './insfrastructure/schemas/user.schema';
import { UserRepositoryMongoAdapter } from './insfrastructure/repositories/user.repository';
import { AuthenticateUserUseCase } from './application/use-cases/authenticateUserUseCase';
import { RegisterUserUseCase } from './application/use-cases/register.usecase';


@Module({
  imports: [
      MongooseModule.forFeature([
        { name: 'User', schema: UserSchema },
    ]),
    ],
  controllers: [AuthController],
  providers: [
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository) => new RegisterUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (userRepository) => new AuthenticateUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: 'UserRepository',
      useClass: UserRepositoryMongoAdapter,
    }
  ],
})
export class AuthModule {}