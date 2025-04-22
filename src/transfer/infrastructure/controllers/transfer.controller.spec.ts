import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { CreateTransferUseCase } from '../../application/use-cases/create-transfer.usecase';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../../application/use-cases/get-companies-with-transfers-last-month.usecase';
import { CreateTransferDto } from '../../application/dto/create-transfer.dto';
import { Transfer } from '../../domain/entities/transfer.entity';

describe('TransferController', () => {
  let controller: TransferController;
  let createTransferUseCase: CreateTransferUseCase;
  let getCompaniesWithTransfersLastMonthUseCase: GetCompaniesWithTransfersLastMonthUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: CreateTransferUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetCompaniesWithTransfersLastMonthUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
    createTransferUseCase = module.get<CreateTransferUseCase>(CreateTransferUseCase);
    getCompaniesWithTransfersLastMonthUseCase = module.get<GetCompaniesWithTransfersLastMonthUseCase>(
      GetCompaniesWithTransfersLastMonthUseCase,
    );
  });

  describe('create', () => {
    it('should create a transfer and return it', async () => {
      const transferDto: CreateTransferDto = {
        amount: 1000,
        companyId: '123',
        creditAccount: '123456789',
        debitAccount: '987654321',
      };
  
      const transfer = new Transfer(
        transferDto.amount,
        transferDto.companyId,
        transferDto.creditAccount,
        transferDto.debitAccount,
        new Date(), // Fecha actual
      );
  
      jest.spyOn(createTransferUseCase, 'execute').mockResolvedValue(transfer);
  
      const result = await controller.create(transferDto);
  
      // Usar expect.objectContaining para evitar problemas con la precisión de la fecha
      expect(createTransferUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: transfer.amount,
          companyId: transfer.companyId,
          creditAccount: transfer.creditAccount,
          debitAccount: transfer.debitAccount,
        }),
      );
  
      // Comparar el resultado completo
      expect(result).toEqual(transfer);
    });
  });

  describe('findCompaniesWithTransfersLastMonth', () => {
    it('should return companies with transfers from the last month', async () => {
      const companiesWithTransfers = [
        {
          cuit: '20-12345678-9', // Agrega el campo cuit
          businessName: 'Empresa A', // Agrega el campo businessName
          registrationDate: new Date('2025-03-01'), // Agrega el campo registrationDate
          transfers: [
            {
              amount: 1000,
              creditAccount: '123456789',
              debitAccount: '987654321',
              createdAt: new Date(),
            },
          ],
        },
      ];
  
      jest.spyOn(getCompaniesWithTransfersLastMonthUseCase, 'execute').mockResolvedValue(companiesWithTransfers);
  
      const result = await controller.findCompaniesWithTransfersLastMonth();
  
      expect(getCompaniesWithTransfersLastMonthUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(companiesWithTransfers);
    });
  });
});