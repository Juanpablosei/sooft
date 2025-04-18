import { Body, ConflictException, Controller, Get, Post } from "@nestjs/common";
import { CreateCompanyDto, GetCompaniesLastMonthUseCase, SaveCompanyUseCase } from "src/company/application";
import { Company } from "src/company/domain";




@Controller('companies')
export class CompanyController {
  constructor(
    private readonly saveCompanyUseCase: SaveCompanyUseCase,
    private readonly getCompaniesLastMonthUseCase: GetCompaniesLastMonthUseCase,
  ) {}

  @Post('create')
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