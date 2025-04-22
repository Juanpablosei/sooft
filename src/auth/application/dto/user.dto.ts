import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEmail, MinLength } from 'class-validator';

export class UserDto {

  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  public readonly password: string;

 
}