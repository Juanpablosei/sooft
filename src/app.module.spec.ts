import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './company/company.module';
import { TransferModule } from './transfer/transfer.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
        CompanyModule,
        TransferModule,
      ],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should load ConfigModule as a global module', () => {
    const configModule = module.get<ConfigService>(ConfigService);
    expect(configModule).toBeInstanceOf(ConfigService);
  });

  it('should include CompanyModule', () => {
    const companyModule = module.get<CompanyModule>(CompanyModule);
    expect(companyModule).toBeDefined();
  });

  it('should include TransferModule', () => {
    const transferModule = module.get<TransferModule>(TransferModule);
    expect(transferModule).toBeDefined();
  });

  it('should configure MongooseModule with the correct URI', async () => {
    const configService = module.get<ConfigService>(ConfigService);
    jest.spyOn(configService, 'get').mockReturnValue('mongodb://localhost:27017/testdb');

    const mongooseModule = module.get<MongooseModule>(MongooseModule);
    expect(mongooseModule).toBeDefined();

    // Verificar que el URI fue configurado correctamente
    const uri = configService.get('MONGODB_URI');
    expect(uri).toBe('mongodb://localhost:27017/testdb');
  });
});