import { Schema } from 'mongoose';

export const TransferSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  creditAccount: {
    type: String,
    required: true,
  },
  debitAccount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
