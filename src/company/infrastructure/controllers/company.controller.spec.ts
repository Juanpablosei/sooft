import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { SaveCompanyUseCase,  } from '../../../company/application/use-cases/register-company.usecase';
import {  GetCompaniesLastMonthUseCase } from '../../../company/application/use-cases/get-companies-last-month.usecase';
import { Company } from '../../../company/domain';
import { CreateCompanyDto } from '../../application/dto/create-company.dto';
import { ConflictException } from '@nestjs/common';

describe('CompanyController', () => {
  let controller: CompanyController;
  let saveCompanyUseCase: jest.Mocked<SaveCompanyUseCase>;
  let getCompaniesLastMonthUseCase: jest.Mocked<GetCompaniesLastMonthUseCase>;

  beforeEach(async () => {
    saveCompanyUseCase = {
      execute: jest.fn(),
    } as any;

    getCompaniesLastMonthUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: SaveCompanyUseCase,
          useValue: saveCompanyUseCase,
        },
        {
          provide: GetCompaniesLastMonthUseCase,
          useValue: getCompaniesLastMonthUseCase,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company successfully', async () => {
      const companyDto: CreateCompanyDto = {
        cuit: '20304050607',
        businessName: 'Company A',
      };

      const company = new Company(
        companyDto.cuit,
        companyDto.businessName,
        new Date(),
      );

      saveCompanyUseCase.execute.mockResolvedValueOnce(company);

      const result = await controller.create(companyDto);

      expect(result).toEqual(company);
      expect(saveCompanyUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          cuit: companyDto.cuit,
          businessName: companyDto.businessName,
        }),
      );
    });

    it('should throw a ConflictException if the company already exists', async () => {
      const companyDto: CreateCompanyDto = {
        cuit: '20304050607',
        businessName: 'Company A',
      };

      saveCompanyUseCase.execute.mockRejectedValueOnce(new Error('Company with this CUIT already exists'));

      await expect(controller.create(companyDto)).rejects.toThrow(ConflictException);
      expect(saveCompanyUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          cuit: companyDto.cuit,
          businessName: companyDto.businessName,
        }),
      );
    });
  });

  describe('findLastMonth', () => {
    it('should return companies created in the last month', async () => {
      const companies = [
        new Company('20304050607', 'Company A', new Date('2025-03-15')),
        new Company('30405060708', 'Company B', new Date('2025-03-20')),
      ];

      getCompaniesLastMonthUseCase.execute.mockResolvedValueOnce(companies);

      const result = await controller.findLastMonth();

      expect(result).toEqual(companies);
      expect(getCompaniesLastMonthUseCase.execute).toHaveBeenCalled();
    });
  });
});