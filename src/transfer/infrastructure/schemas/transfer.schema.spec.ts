import { TransferSchema } from './transfer.schema';
import mongoose from 'mongoose';

describe('TransferSchema', () => {
  let TransferModel: mongoose.Model<any>;

  beforeAll(() => {
    // Crear un modelo de Mongoose usando el esquema
    TransferModel = mongoose.model('Transfer', TransferSchema);
  });

  afterAll(() => {
    // Eliminar el modelo después de las pruebas
    mongoose.deleteModel('Transfer');
  });

  it('should define the schema correctly', () => {
    const schemaPaths = Object.keys(TransferSchema.paths);
    expect(schemaPaths).toEqual(
      expect.arrayContaining(['amount', 'companyId', 'creditAccount', 'debitAccount', 'date']),
    );
  });

  it('should require all fields', async () => {
    const transfer = new TransferModel({}); // Sin valores
    const error = transfer.validateSync();

    expect(error).toBeDefined();
    expect(error.errors['amount']).toBeDefined();
    expect(error.errors['companyId']).toBeDefined();
    expect(error.errors['creditAccount']).toBeDefined();
    expect(error.errors['debitAccount']).toBeDefined();
    expect(error.errors['date']).toBeDefined();
  });

  it('should validate a valid transfer', async () => {
    const transferData = {
      amount: 1000,
      companyId: '20304050607',
      creditAccount: '1234567890',
      debitAccount: '0987654321',
      date: new Date(),
    };

    const transfer = new TransferModel(transferData);
    const error = transfer.validateSync();

    expect(error).toBeUndefined();
    expect(transfer.amount).toBe(transferData.amount);
    expect(transfer.companyId).toBe(transferData.companyId);
    expect(transfer.creditAccount).toBe(transferData.creditAccount);
    expect(transfer.debitAccount).toBe(transferData.debitAccount);
    expect(transfer.date).toEqual(transferData.date);
  });

  it('should fail validation if amount is not a number', async () => {
    const transferData = {
      amount: 'not-a-number',
      companyId: '20304050607',
      creditAccount: '1234567890',
      debitAccount: '0987654321',
      date: new Date(),
    };

    const transfer = new TransferModel(transferData);
    const error = transfer.validateSync();

    expect(error).toBeDefined();
    expect(error.errors['amount']).toBeDefined();
  });

  it('should fail validation if date is missing', async () => {
    const transferData = {
      amount: 1000,
      companyId: '20304050607',
      creditAccount: '1234567890',
      debitAccount: '0987654321',
    };

    const transfer = new TransferModel(transferData);
    const error = transfer.validateSync();

    expect(error).toBeDefined();
    expect(error.errors['date']).toBeDefined();
  });
});