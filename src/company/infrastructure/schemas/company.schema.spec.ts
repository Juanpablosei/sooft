import { CompanySchema } from './company.schema';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('CompanySchema', () => {
  let CompanyModel: mongoose.Model<any>;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Inicia MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Conéctate a la base de datos en memoria
    await mongoose.connect(uri);

    // Crea el modelo usando el esquema
    CompanyModel = mongoose.model('Company', CompanySchema);
  });

  afterAll(async () => {
    // Cierra la conexión y detén MongoDB en memoria
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpia la colección después de cada prueba
    await CompanyModel.deleteMany({});
  });

  it('should define the schema correctly', () => {
    const schemaPaths = Object.keys(CompanySchema.paths);
    expect(schemaPaths).toEqual(
      expect.arrayContaining(['cuit', 'businessName', 'registrationDate']),
    );
  });

  it('should require all fields', async () => {
    const company = new CompanyModel({}); // Sin valores
    const error = company.validateSync();

    expect(error).toBeDefined();
    expect(error.errors['cuit']).toBeDefined();
    expect(error.errors['businessName']).toBeDefined();
  });

  it('should enforce unique CUIT', async () => {
    const companyData1 = {
      cuit: '20304050607',
      businessName: 'Company A',
    };

    const companyData2 = {
      cuit: '20304050607', // Mismo CUIT que el anterior
      businessName: 'Company B',
    };

    const company1 = new CompanyModel(companyData1);
    await company1.save();

    const company2 = new CompanyModel(companyData2);

    await expect(company2.save()).rejects.toThrow(/duplicate key error/); // Verifica el error de clave duplicada
  });

  it('should set registrationDate to current date by default', async () => {
    const companyData = {
      cuit: '20304050607',
      businessName: 'Company A',
    };

    const company = new CompanyModel(companyData);
    await company.save();

    expect(company.registrationDate).toBeDefined();
    expect(company.registrationDate).toBeInstanceOf(Date);
  });

  it('should validate a valid company', async () => {
    const companyData = {
      cuit: '20304050607',
      businessName: 'Company A',
      registrationDate: new Date('2025-03-15'),
    };

    const company = new CompanyModel(companyData);
    const error = company.validateSync();

    expect(error).toBeUndefined();
    expect(company.cuit).toBe(companyData.cuit);
    expect(company.businessName).toBe(companyData.businessName);
    expect(company.registrationDate).toEqual(companyData.registrationDate);
  });
});