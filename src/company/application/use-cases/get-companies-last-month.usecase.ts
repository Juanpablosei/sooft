import { Company, CompanyRepository } from "../../../company/domain";



export class GetCompaniesLastMonthUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(): Promise<Company[]> {
    return await this.companyRepository.findCompaniesRegisteredLastMonth();
  }
}

