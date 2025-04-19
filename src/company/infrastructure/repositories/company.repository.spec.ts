import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepositoryMongoAdapter } from './company.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../../company/domain';
import { CompanyDocument } from '../interface/company.document';

describe('CompanyRepositoryMongoAdapter', () => {
  let repository: CompanyRepositoryMongoAdapter;
  let companyModel: Model<CompanyDocument>;

  // Mock del modelo de Mongoose que simula el constructor
  const mockCompanyModel = jest.fn().mockImplementation(function (this: any, data: any) {
    Object.assign(this, data);
    return {
      save: jest.fn().mockResolvedValue(this), 
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRepositoryMongoAdapter,
        {
          provide: getModelToken('Company'),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    repository = module.get<CompanyRepositoryMongoAdapter>(CompanyRepositoryMongoAdapter);
    companyModel = module.get<Model<CompanyDocument>>(getModelToken('Company'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a company and return it', async () => {
      const company = new Company('20-12345678-9', 'Test Business', new Date('2025-04-01'));

      const result = await repository.save(company);

      expect(mockCompanyModel).toHaveBeenCalledWith({
        cuit: company.cuit,
        businessName: company.businessName,
        registrationDate: company.registrationDate,
      });
      expect(result).toEqual(company);
    });
  });

  describe('existsByCuit', () => {
    it('should return true if the company exists', async () => {
      const existsMock = jest.fn().mockResolvedValue(true);
      (companyModel as any).exists = existsMock;

      const result = await repository.existsByCuit('20-12345678-9');

      expect(existsMock).toHaveBeenCalledWith({ cuit: '20-12345678-9' });
      expect(result).toBe(true);
    });

    it('should return false if the company does not exist', async () => {
      const existsMock = jest.fn().mockResolvedValue(null);
      (companyModel as any).exists = existsMock;

      const result = await repository.existsByCuit('20-12345678-9');

      expect(existsMock).toHaveBeenCalledWith({ cuit: '20-12345678-9' });
      expect(result).toBe(false);
    });
  });

  describe('findCompaniesRegisteredLastMonth', () => {
    it('should return companies registered in the last month', async () => {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const mockCompanies = [
        { cuit: '20-12345678-9', businessName: 'Test Business A', registrationDate: oneMonthAgo },
        { cuit: '20-87654321-0', businessName: 'Test Business B', registrationDate: now },
      ];

      const findMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompanies),
      });
      (companyModel as any).find = findMock;

      const result = await repository.findCompaniesRegisteredLastMonth();

      expect(findMock).toHaveBeenCalledWith({ registrationDate: { $gte: oneMonthAgo } });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(new Company('20-12345678-9', 'Test Business A', oneMonthAgo));
      expect(result[1]).toEqual(new Company('20-87654321-0', 'Test Business B', now));
    });
  });

  describe('findByCuit', () => {
    it('should return a company if found', async () => {
      const mockCompany = {
        cuit: '20-12345678-9',
        businessName: 'Test Business',
        registrationDate: new Date('2025-04-01'),
      };

      const findOneMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCompany),
      });
      (companyModel as any).findOne = findOneMock;

      const result = await repository.findByCuit('20-12345678-9');

      expect(findOneMock).toHaveBeenCalledWith({ cuit: '20-12345678-9' });
      expect(result).toEqual(new Company('20-12345678-9', 'Test Business', new Date('2025-04-01')));
    });

    it('should return null if no company is found', async () => {
      const findOneMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      (companyModel as any).findOne = findOneMock;

      const result = await repository.findByCuit('20-12345678-9');

      expect(findOneMock).toHaveBeenCalledWith({ cuit: '20-12345678-9' });
      expect(result).toBeNull();
    });
  });
});