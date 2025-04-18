import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(20|23|24|27|30|33|34)-[0-9]{8}-[0-9]$/, { message: 'CUIT must be 11 digits' })
  cuit: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;
}
