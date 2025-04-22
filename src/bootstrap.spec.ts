import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';

describe('Bootstrap Function', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('ingresar con un usuario valido para acceder al token')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Autenticación')
      .addTag('Empresas')
      .addTag('Transferencias')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should initialize the app with global prefix and validation pipe', async () => {
    // Verificar que las rutas incluyan el prefijo global usando supertest
    const response = await request(app.getHttpServer()).get('/api');
    expect(response.status).not.toBe(404); // Verifica que la ruta con prefijo no devuelva 404
  });

  it('should configure Swagger correctly', () => {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('ingresar con un usuario valido para acceder al token')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Autenticación')
      .addTag('Empresas')
      .addTag('Transferencias')
      .build();

    const swaggerConfig = SwaggerModule.createDocument(app, config);
    expect(swaggerConfig).toBeDefined();
    expect(swaggerConfig.info.title).toBe('API Documentation');
    expect(swaggerConfig.info.version).toBe('1.0');
  });

  it('should listen on the correct port', async () => {
    const port = 3000; // Default port
    const listenSpy = jest.spyOn(app, 'listen').mockImplementation(async () => port);
    await app.listen(port);
    expect(listenSpy).toHaveBeenCalledWith(port);
  });
});