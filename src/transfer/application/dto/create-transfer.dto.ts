import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  debitAccount: string;

  @IsString()
  @IsNotEmpty()
  creditAccount: string;
}
