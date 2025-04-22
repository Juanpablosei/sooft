import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class UserDto {

  @ApiProperty({ example: 'user2@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  public readonly email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z]).{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, 6 números y una letra',
  })
  public readonly password: string;

}