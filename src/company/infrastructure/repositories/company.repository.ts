import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyRepository } from 'src/company/domain';
import { CompanyDocument } from '../interface/company.document';



@Injectable()
export class CompanyRepositoryMongoAdapter implements CompanyRepository {
  constructor(@InjectModel('Company') private readonly companyModel: Model<CompanyDocument>) {}

  async save(company: Company): Promise<Company> {
    const createdCompany = new this.companyModel({
      cuit: company.cuit,
      businessName: company.businessName,
      registrationDate: company.registrationDate,
    });
    const savedCompany = await createdCompany.save();
    return new Company(savedCompany.cuit, savedCompany.businessName, savedCompany.registrationDate);
  }

  async existsByCuit(cuit: string): Promise<boolean> {
    const result = await this.companyModel.exists({ cuit });
    return result !== null; 
  }

  async findCompaniesRegisteredLastMonth(): Promise<Company[]> {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const companies = await this.companyModel
      .find({ registrationDate: { $gte: oneMonthAgo } })
      .exec();

    return companies.map(
      (company) => new Company(company.cuit, company.businessName, company.registrationDate),
    );
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    const company = await this.companyModel.findOne({ cuit }).exec();
    if (!company) {
      return null;
    }
    return new Company(company.cuit, company.businessName, company.registrationDate);
  }
}