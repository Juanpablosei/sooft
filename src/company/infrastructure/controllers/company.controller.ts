import { Body, ConflictException, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateCompanyDto } from "../../../company/application/dto/create-company.dto";
import { SaveCompanyUseCase } from "../../../company/application/use-cases/register-company.usecase";
import { GetCompaniesLastMonthUseCase } from "../../../company/application/use-cases/get-companies-last-month.usecase";
import { Company } from "../../../company/domain";
import { JwtAuthGuard } from "../../../auth/insfrastructure/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly saveCompanyUseCase: SaveCompanyUseCase,
    private readonly getCompaniesLastMonthUseCase: GetCompaniesLastMonthUseCase,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente.' })
  @ApiResponse({ status: 409, description: 'La empresa ya existe.' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener empresas creadas en el último mes' })
  @ApiResponse({ status: 200, description: 'Lista de empresas.' })
  @Get('last-month')
  async findLastMonth(): Promise<Company[]> {
    return await this.getCompaniesLastMonthUseCase.execute();
  }
}