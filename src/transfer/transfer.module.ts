import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateTransferUseCase, GetCompaniesWithTransfersLastMonthUseCase } from './application';
import { CompanyRepositoryMongoAdapter, CompanySchema } from 'src/company/infrastructure';
import { TransferController, TransferRepositoryMongoAdapter, TransferSchema } from './infrastructure';

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