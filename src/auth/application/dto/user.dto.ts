import { IsString, IsNotEmpty, IsUUID, IsEmail, MinLength } from 'class-validator';

export class UserDto {

  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  public readonly password: string;

 
}