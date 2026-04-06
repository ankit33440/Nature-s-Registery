import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        const raw = resp['message'];
        message = Array.isArray(raw)
          ? (raw as string[]).join('; ')
          : typeof raw === 'string'
            ? raw
            : exception.message;
        errorCode = typeof resp['errorCode'] === 'string' ? resp['errorCode'] : undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const body: Record<string, unknown> = {
      success: false,
      message,
      statusCode,
      path: request.url,
    };
    if (errorCode) body['errorCode'] = errorCode;

    response.status(statusCode).json(body);
  }
}
