import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateTransferUseCase } from '../../application/use-cases/create-transfer.usecase';
import { GetCompaniesWithTransfersLastMonthUseCase }
 from '../../application/use-cases/get-companies-with-transfers-last-month.usecase';
import { Transfer } from '../../domain/entities/transfer.entity';
import { CreateTransferDto } from '../../application/dto/create-transfer.dto';



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