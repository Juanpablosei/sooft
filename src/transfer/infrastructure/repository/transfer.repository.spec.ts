import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransferRepositoryMongoAdapter } from './transfer.repository';
import { Transfer } from '../../../transfer/domain';

describe('TransferRepositoryMongoAdapter', () => {
  let repository: TransferRepositoryMongoAdapter;
  let transferModel: jest.Mocked<Model<any>>;

  beforeEach(async () => {
    transferModel = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferRepositoryMongoAdapter,
        {
          provide: getModelToken('Transfer'),
          useValue: transferModel,
        },
      ],
    }).compile();

    repository = module.get<TransferRepositoryMongoAdapter>(TransferRepositoryMongoAdapter);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

 

  describe('findByDateRange', () => {
    it('should return a list of transfers within the given date range', async () => {
      const startDate = new Date('2025-03-01');
      const endDate = new Date('2025-03-31');

      const mockTransfers = [
        {
          amount: 1000,
          companyId: '20304050607',
          creditAccount: '1234567890',
          debitAccount: '0987654321',
          date: new Date('2025-03-15'),
        },
        {
          amount: 2000,
          companyId: '30405060708',
          creditAccount: '0987654321',
          debitAccount: '1234567890',
          date: new Date('2025-03-20'),
        },
      ];

      transferModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockTransfers),
      } as any);

      const result = await repository.findByDateRange(startDate, endDate);

      expect(transferModel.find).toHaveBeenCalledWith({
        date: { $gte: startDate, $lte: endDate },
      });
      expect(result).toEqual(mockTransfers.map(
        (t) => new Transfer(t.amount, t.companyId, t.creditAccount, t.debitAccount, t.date),
      ));
    });

    it('should return an empty list if no transfers are found in the given date range', async () => {
      const startDate = new Date('2025-03-01');
      const endDate = new Date('2025-03-31');

      transferModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await repository.findByDateRange(startDate, endDate);

      expect(transferModel.find).toHaveBeenCalledWith({
        date: { $gte: startDate, $lte: endDate },
      });
      expect(result).toEqual([]);
    });
  });
});