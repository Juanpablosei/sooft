import { Company } from "src/company/domain/entities/company.entity";
import { CompanyRepository } from "src/company/domain/repositories/company.repository.port";


export class GetCompaniesLastMonthUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(): Promise<Company[]> {
    return await this.companyRepository.findCompaniesRegisteredLastMonth();
  }
}

