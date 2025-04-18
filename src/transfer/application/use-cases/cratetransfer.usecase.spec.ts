import { NotFoundException } from '@nestjs/common';
import { Transfer } from '../../../transfer/domain';
import { CompanyRepository } from '../../../company/domain';
import { TransferRepository } from '../../../transfer/domain';
import { CreateTransferUseCase } from './create-transfer.usecase';

describe('CreateTransferUseCase', () => {
  let createTransferUseCase: CreateTransferUseCase;
  let transferRepository: jest.Mocked<TransferRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    transferRepository = {
      save: jest.fn(),
    } as any;

    companyRepository = {
      existsByCuit: jest.fn(),
    } as any;

    createTransferUseCase = new CreateTransferUseCase(transferRepository, companyRepository);
  });

  it('should create a transfer when the company exists', async () => {
    const transfer = new Transfer(1000, '20304050607', '1234567890', '0987654321', new Date());

    companyRepository.existsByCuit.mockResolvedValueOnce(true);
    transferRepository.save.mockResolvedValueOnce(transfer);

    const result = await createTransferUseCase.execute(transfer);

    expect(companyRepository.existsByCuit).toHaveBeenCalledWith('20304050607');
    expect(transferRepository.save).toHaveBeenCalledWith(transfer);
    expect(result).toBe(transfer);
  });

  it('should throw NotFoundException if the company does not exist', async () => {
    const transfer = new Transfer(1000, '20304050607', '1234567890', '0987654321', new Date());

    companyRepository.existsByCuit.mockResolvedValueOnce(false);

    await expect(createTransferUseCase.execute(transfer)).rejects.toThrow(
      new NotFoundException(`The company with CUIT ${transfer.companyId} does not exist.`),
    );

    expect(companyRepository.existsByCuit).toHaveBeenCalledWith('20304050607');
    expect(transferRepository.save).not.toHaveBeenCalled();
  });
});