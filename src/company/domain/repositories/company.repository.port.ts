import { Company } from "../entities/company.entity";

export interface CompanyRepository {
  save(company: Company): Promise<Company>;
  existsByCuit(cuit: string): Promise<boolean>;
  findCompaniesRegisteredLastMonth(): Promise<Company[]>;
  findByCuit(cuit: string): Promise<Company | null>;
}