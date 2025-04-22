import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 500, description: 'Monto de la transferencia' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '20-12345678-9', description: 'CUIT de la empresa' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ example: '123456789', description: 'Cuenta de origen' })
  @IsString()
  @IsNotEmpty()
  debitAccount: string;

  @ApiProperty({ example: '987654321', description: 'Cuenta de destino' })
  @IsString()
  @IsNotEmpty()
  creditAccount: string;
}
