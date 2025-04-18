import { Transfer } from "../entities/transfer.entity";

export interface TransferRepository {
  save(transfer: Transfer): Promise<Transfer>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transfer[]>;
}