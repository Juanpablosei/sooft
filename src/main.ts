import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';



export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            
    forbidNonWhitelisted: true,
    transform: true,            
  }));

  app.use(helmet());

  
  app.use(
    rateLimit({
      windowMs: 60 * 1000, 
      max: 100, 
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  

  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  
  .setDescription('ingresar con un  usuario valido para acceder al token ')
  .setVersion('1.0')
  .addBearerAuth() 
  .addTag('Autenticación')
  .addTag('Empresas')
  .addTag('Transferencias')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

app.useGlobalFilters(new AllExceptionsFilter());


  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(` Server running on http://localhost:${port}`);

}
bootstrap();
