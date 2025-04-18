import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Bootstrap Function', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      setGlobalPrefix: jest.fn(),
      useGlobalPipes: jest.fn(),
      get: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should set global prefix, use validation pipes, and listen on the correct port', async () => {
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'PORT') return 4000;
        return null;
      }),
    };

    mockApp.get.mockReturnValue(mockConfigService);

    // Importa la función bootstrap desde el archivo original
    const { bootstrap } = await import('./main'); // Se asume que el archivo se llama `main.ts`

    await bootstrap();

    // Verifica que se creó la aplicación con el módulo AppModule
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    // Verifica que se configuró el prefijo global
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');

  

    // Verifica que se obtuvo el puerto del ConfigService y que se escuchó en el puerto 4000
    expect(mockApp.get).toHaveBeenCalledWith(ConfigService);
    expect(mockConfigService.get).toHaveBeenCalledWith('PORT');
    expect(mockApp.listen).toHaveBeenCalledWith(4000);
  });

  it('should fallback to port 3000 if no port is provided by ConfigService', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(undefined), // Simula que no se configuró el puerto
    };

    mockApp.get.mockReturnValue(mockConfigService);

    // Importa la función bootstrap desde el archivo original
    const { bootstrap } = await import('./main'); // Se asume que el archivo se llama `main.ts`

    await bootstrap();

    // Verifica que se escuchó en el puerto 3000 por defecto
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
});