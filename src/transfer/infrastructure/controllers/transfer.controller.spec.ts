import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { CreateTransferUseCase } from '../../application/use-cases/create-transfer.usecase';
import { GetCompaniesWithTransfersLastMonthUseCase }
 from '../../application/use-cases/get-companies-with-transfers-last-month.usecase';
import { Transfer } from '../../domain/entities/transfer.entity';
import { CreateTransferDto } from '../../application/dto/create-transfer.dto';

describe('TransferController', () => {
  let controller: TransferController;
  let createTransferUseCase: jest.Mocked<CreateTransferUseCase>;
  let getCompaniesWithTransfersLastMonthUseCase: jest.Mocked<GetCompaniesWithTransfersLastMonthUseCase>;

  beforeEach(async () => {
    createTransferUseCase = {
      execute: jest.fn(),
    } as any;

    getCompaniesWithTransfersLastMonthUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: CreateTransferUseCase,
          useValue: createTransferUseCase,
        },
        {
          provide: GetCompaniesWithTransfersLastMonthUseCase,
          useValue: getCompaniesWithTransfersLastMonthUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transfer', async () => {
      const transferDto: CreateTransferDto = {
        amount: 1000,
        companyId: '20304050607',
        creditAccount: '1234567890',
        debitAccount: '0987654321',
      };

      const transfer = new Transfer(
        transferDto.amount,
        transferDto.companyId,
        transferDto.creditAccount,
        transferDto.debitAccount,
        new Date(),
      );

      createTransferUseCase.execute.mockResolvedValueOnce(transfer);

      const result = await controller.create(transferDto);

      expect(result).toEqual(transfer);
      expect(createTransferUseCase.execute).toHaveBeenCalledWith(transfer);
    });
  });

  describe('findCompaniesWithTransfersLastMonth', () => {
    it('should return companies with transfers in the last month', async () => {
      const companies = [
        { businessName: 'Company A', cuit: '20304050607', registrationDate: new Date() },
        { businessName: 'Company B', cuit: '30405060708', registrationDate: new Date() },
      ];

      getCompaniesWithTransfersLastMonthUseCase.execute.mockResolvedValueOnce(companies);

      const result = await controller.findCompaniesWithTransfersLastMonth();

      expect(result).toEqual(companies);
      expect(getCompaniesWithTransfersLastMonthUseCase.execute).toHaveBeenCalled();
    });
  });

  
});