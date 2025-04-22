import { AllExceptionsFilter } from './all-exceptions.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
        getRequest: jest.fn().mockReturnValue({
          url: '/test-route',
        }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const response = mockArgumentsHost.switchToHttp().getResponse<Response>();
    const request = mockArgumentsHost.switchToHttp().getRequest<Request>();

    filter.catch(exception, mockArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: request.url,
      message: 'Forbidden',
    });
  });

  it('should handle non-HttpException correctly', () => {
    const exception = new Error('Unexpected error');
    const response = mockArgumentsHost.switchToHttp().getResponse<Response>();
    const request = mockArgumentsHost.switchToHttp().getRequest<Request>();

    filter.catch(exception, mockArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: request.url,
      message: 'Internal server error',
    });
  });
});