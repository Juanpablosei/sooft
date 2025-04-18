import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDocument } from '../interface/company.document';
import { Company } from '../../../company/domain';
import { CompanyRepositoryMongoAdapter } from './company.repository';

describe('CompanyRepositoryMongoAdapter', () => {
    let repository: CompanyRepositoryMongoAdapter;
    let companyModel: jest.Mocked<Model<CompanyDocument>>;

    beforeEach(async () => {
        companyModel = {
            create: jest.fn(),
            save: jest.fn(),
            exists: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyRepositoryMongoAdapter,
                {
                    provide: getModelToken('Company'),
                    useValue: companyModel,
                },
            ],
        }).compile();

        repository = module.get<CompanyRepositoryMongoAdapter>(CompanyRepositoryMongoAdapter);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });




    describe('findCompaniesRegisteredLastMonth', () => {
        it('should return a list of companies registered last month', async () => {
            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);

            const mockCompanies = [
                { cuit: '20304050607', businessName: 'Company A', registrationDate: oneMonthAgo },
                { cuit: '30405060708', businessName: 'Company B', registrationDate: oneMonthAgo },
            ];

            companyModel.find.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(mockCompanies),
            } as any);

            const result = await repository.findCompaniesRegisteredLastMonth();

            expect(companyModel.find).toHaveBeenCalledWith({ registrationDate: { $gte: oneMonthAgo } });
            expect(result).toEqual(mockCompanies.map(
                (company) => new Company(company.cuit, company.businessName, company.registrationDate),
            ));
        });
    });

    describe('findByCuit', () => {
        it('should return a company with the given CUIT', async () => {
            const mockCompany = { cuit: '20304050607', businessName: 'Company A', registrationDate: new Date('2025-03-15') };

            companyModel.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(mockCompany),
            } as any);

            const result = await repository.findByCuit('20304050607');

            expect(companyModel.findOne).toHaveBeenCalledWith({ cuit: '20304050607' });
            expect(result).toEqual(new Company(mockCompany.cuit, mockCompany.businessName, mockCompany.registrationDate));
        });

        it('should return null if no company with the given CUIT exists', async () => {
            companyModel.findOne.mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(null),
            } as any);

            const result = await repository.findByCuit('20304050607');

            expect(companyModel.findOne).toHaveBeenCalledWith({ cuit: '20304050607' });
            expect(result).toBeNull();
        });
    });
});