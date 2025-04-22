import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            
    forbidNonWhitelisted: true,
    transform: true,            
  }));

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


  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(` Server running on http://localhost:${port}`);

}
bootstrap();
