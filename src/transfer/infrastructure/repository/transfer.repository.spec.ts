import { Test, TestingModule } from '@nestjs/testing';
import { TransferRepositoryMongoAdapter } from './transfer.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from '../../../transfer/domain';

describe('TransferRepositoryMongoAdapter', () => {
  let repository: TransferRepositoryMongoAdapter;
  let transferModel: Model<any>;

  // Mock del modelo de Mongoose
  const mockTransferModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data), // Simula el método save
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferRepositoryMongoAdapter,
        {
          provide: getModelToken('Transfer'),
          useValue: mockTransferModel,
        },
      ],
    }).compile();

    repository = module.get<TransferRepositoryMongoAdapter>(TransferRepositoryMongoAdapter);
    transferModel = module.get<Model<any>>(getModelToken('Transfer'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a transfer and return it', async () => {
      const transfer = new Transfer(
        1000.5,
        '20-37121543-6',
        '1234567890',
        '0987654321',
        new Date('2025-04-18T14:15:53.312Z'),
      );

      const result = await repository.save(transfer);

      expect(mockTransferModel).toHaveBeenCalledWith({
        amount: transfer.amount,
        companyId: transfer.companyId,
        creditAccount: transfer.creditAccount,
        debitAccount: transfer.debitAccount,
        date: transfer.date,
      });
      expect(result).toEqual(transfer);
    });
  });

  describe('findByDateRange', () => {
    it('should return transfers within the specified date range', async () => {
      const startDate = new Date('2025-04-01T00:00:00.000Z');
      const endDate = new Date('2025-04-30T23:59:59.999Z');

      const mockTransfers = [
        {
          amount: 1000.5,
          companyId: '20-37121543-6',
          creditAccount: '1234567890',
          debitAccount: '0987654321',
          date: new Date('2025-04-10T12:00:00.000Z'),
        },
        {
          amount: 1500.75,
          companyId: '20-37121543-7',
          creditAccount: '2233445566',
          debitAccount: '6655443322',
          date: new Date('2025-04-15T12:00:00.000Z'),
        },
      ];

      const mockFind = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransfers),
      });
      transferModel.find = mockFind;

      const result = await repository.findByDateRange(startDate, endDate);

      expect(mockFind).toHaveBeenCalledWith({ date: { $gte: startDate, $lte: endDate } });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        new Transfer(
          mockTransfers[0].amount,
          mockTransfers[0].companyId,
          mockTransfers[0].creditAccount,
          mockTransfers[0].debitAccount,
          mockTransfers[0].date,
        ),
      );
      expect(result[1]).toEqual(
        new Transfer(
          mockTransfers[1].amount,
          mockTransfers[1].companyId,
          mockTransfers[1].creditAccount,
          mockTransfers[1].debitAccount,
          mockTransfers[1].date,
        ),
      );
    });

    it('should return an empty array if no transfers are found', async () => {
      const startDate = new Date('2025-04-01T00:00:00.000Z');
      const endDate = new Date('2025-04-30T23:59:59.999Z');

      const mockFind = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      transferModel.find = mockFind;

      const result = await repository.findByDateRange(startDate, endDate);

      expect(mockFind).toHaveBeenCalledWith({ date: { $gte: startDate, $lte: endDate } });
      expect(result).toHaveLength(0);
    });
  });
});