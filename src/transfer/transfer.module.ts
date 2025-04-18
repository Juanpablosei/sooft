import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyRepositoryMongoAdapter } from '../company/infrastructure/repositories/company.repository';
import {  CompanySchema } from '../company/infrastructure/schemas/company.schema';
import { TransferController} from './infrastructure/controllers/transfer.controller';
import { TransferSchema } from './infrastructure/schemas/transfer.schema';
import { TransferRepositoryMongoAdapter } from './infrastructure/repository/transfer.repository';
import { CreateTransferUseCase } from './application/use-cases/create-transfer.usecase';
import { GetCompaniesWithTransfersLastMonthUseCase } from './application/use-cases/get-companies-with-transfers-last-month.usecase';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transfer', schema: TransferSchema },
      { name: 'Company', schema: CompanySchema },
    ]),
  ],
  controllers: [TransferController],
  providers: [
    {
      provide: 'TransferRepository',
      useClass: TransferRepositoryMongoAdapter,
    },
    {
      provide: 'CompanyRepository',
      useClass: CompanyRepositoryMongoAdapter,
    },
    
    {
      provide: CreateTransferUseCase,
      useFactory: (transferRepository, companyRepository) =>
        new CreateTransferUseCase(transferRepository, companyRepository),
      inject: ['TransferRepository', 'CompanyRepository'],
    },
  
    {
      provide: GetCompaniesWithTransfersLastMonthUseCase,
      useFactory: (transferRepository, companyRepository) =>
        new GetCompaniesWithTransfersLastMonthUseCase(transferRepository, companyRepository),
      inject: ['TransferRepository', 'CompanyRepository'],
    },
  ],
})
export class TransferModule {}