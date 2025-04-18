import { Controller, Post, Body, ConflictException, Get } from '@nestjs/common';
import { CreateCompanyDto } from 'src/company/application/dto/create-company.dto';
import { SaveCompanyUseCase } from 'src/company/application/use-cases/register-company.usecase';
import { Company } from 'src/company/domain/entities/company.entity';
import { GetCompaniesLastMonthUseCase } from '../../application/use-cases/get-companies-last-month.usecase';




@Controller('companies')
export class CompanyController {
  constructor(
    private readonly saveCompanyUseCase: SaveCompanyUseCase,
    private readonly getCompaniesLastMonthUseCase: GetCompaniesLastMonthUseCase,
  ) {}

  @Post()
  async create(@Body() companyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company = new Company(
        companyDto.cuit,
        companyDto.businessName,
        new Date(), 
       
      );

      return await this.saveCompanyUseCase.execute(company);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('last-month')
  async findLastMonth(): Promise<Company[]> {
    return await this.getCompaniesLastMonthUseCase.execute();
  }
}