
import { NotFoundException } from '@nestjs/common';
import { CompanyRepository } from 'src/company/domain/repositories/company.repository.port';
import { Transfer } from 'src/transfer/domain/entities/transfer.entity';
import { TransferRepository } from 'src/transfer/domain/repositories/transfer.repository.port';

export class CreateTransferUseCase {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(transfer: Transfer): Promise<Transfer> {
   
    const companyExists = await this.companyRepository.existsByCuit(transfer.companyId);
    if (!companyExists) {
      throw new NotFoundException(`The company with CUIT ${transfer.companyId} does not exist.`);
    }

   
    return await this.transferRepository.save(transfer);
  }
}