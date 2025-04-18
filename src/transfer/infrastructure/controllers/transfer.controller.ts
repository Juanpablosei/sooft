import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateTransferDto, CreateTransferUseCase, GetCompaniesWithTransfersLastMonthUseCase } from 'src/transfer/application';
import { Transfer } from 'src/transfer/domain';



@Controller('transfers')
export class TransferController {
  constructor(
    private readonly createTransferUseCase: CreateTransferUseCase,
    private readonly GetCompaniesWithTransfersLastMonthUseCase: GetCompaniesWithTransfersLastMonthUseCase,
  ) {}

  @Post("create")
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