import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateTransferDto } from 'src/transfer/application/dto/create-transfer.dto';
import { CreateTransferUseCase } from 'src/transfer/application/use-cases/create-transfer.usecase';
import { GetCompaniesWithTransfersLastMonthUseCase } from 'src/transfer/application/use-cases/get-companies-with-transfers-last-month.usecase';
import { Transfer } from 'src/transfer/domain/entities/transfer.entity';


@Controller('transfers')
export class TransferController {
  constructor(
    private readonly createTransferUseCase: CreateTransferUseCase,
    private readonly GetCompaniesWithTransfersLastMonthUseCase: GetCompaniesWithTransfersLastMonthUseCase,
  ) {}

  @Post()
  async create(@Body() transferDto: CreateTransferDto): Promise<Transfer> {
    const transfer = new Transfer(
      transferDto.amount,
      transferDto.companyId,
      transferDto.creditAccount,
      transferDto.debitAccount,
      new Date(), 
    );
    return await this.createTransferUseCase.execute(transfer);
  }

  @Get("last-month")
  async findCompaniesWithTransfersLastMonth() {
    return await this.GetCompaniesWithTransfersLastMonthUseCase.execute();
  }

 
}