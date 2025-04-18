import { Company } from "src/company/domain/entities/company.entity";
import { CompanyRepository } from "src/company/domain/repositories/company.repository.port";


export class SaveCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(company: Company): Promise<Company> {
    const exists = await this.companyRepository.existsByCuit(company.cuit);
    if (exists) {
      throw new Error(`A company with CUIT ${company.cuit} already exists.`);
    }
    return this.companyRepository.save(company);
  }
}