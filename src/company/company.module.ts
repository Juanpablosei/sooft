import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './infrastructure/schemas/company.schema';
import { SaveCompanyUseCase } from './application/use-cases/register-company.usecase';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { CompanyRepositoryMongoAdapter } from './infrastructure/repositories/company.repository';
import { GetCompaniesLastMonthUseCase } from './application/use-cases/get-companies-last-month.usecase';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    AuthModule,
    
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: 'CompanyRepository',
      useClass: CompanyRepositoryMongoAdapter,
    },
    {
      provide: SaveCompanyUseCase,
      useFactory: (companyRepository) => new SaveCompanyUseCase(companyRepository),
      inject: ['CompanyRepository'],
    },
    {
      provide: GetCompaniesLastMonthUseCase,
      useFactory: (companyRepository) => new GetCompaniesLastMonthUseCase(companyRepository),
      inject: ['CompanyRepository'],
    },
  ],
})
export class CompanyModule {}