import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from 'mongoose';
import { Transfer, TransferRepository } from '../../../transfer/domain';


interface TransferDocument extends Document {
  amount: number;
  companyId: string;
  creditAccount: string;
  debitAccount: string;
  date: Date;
}

@Injectable()
export class TransferRepositoryMongoAdapter implements TransferRepository {
  constructor(
    @InjectModel('Transfer') private readonly transferModel: Model<TransferDocument>,
  ) {}

  async save(transfer: Transfer): Promise<Transfer> {
    const createdTransfer = new this.transferModel({
      amount: transfer.amount,
      companyId: transfer.companyId,
      creditAccount: transfer.creditAccount,
      debitAccount: transfer.debitAccount,
      date: transfer.date,
    });
    const savedTransfer = await createdTransfer.save();
    return new Transfer(
      savedTransfer.amount,
      savedTransfer.companyId,
      savedTransfer.creditAccount,
      savedTransfer.debitAccount,
      savedTransfer.date,
    );
  }

  

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transfer[]> {
    const transfers = await this.transferModel
      .find({ date: { $gte: startDate, $lte: endDate } })
      .exec();
    return transfers.map(
      (t) =>
        new Transfer(
          t.amount,
          t.companyId,
          t.creditAccount,
          t.debitAccount,
          t.date,
        ),
    );
  }
}