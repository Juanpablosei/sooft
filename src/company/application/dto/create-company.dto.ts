import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: '20-22558899-9', description: 'CUIT de la empresa' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(20|23|24|27|30|33|34)-[0-9]{8}-[0-9]$/, { message: 'CUIT must be 11 digits' })
  cuit: string;

  @ApiProperty({ example: 'My Company', description: 'Nombre de la empresa' })
  @MinLength(3, { message: 'Business name must be at least 3 characters long' })
  @IsString()
  @IsNotEmpty()
  businessName: string;
}
