import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { Prisma } from '@prisma/client';

export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error.';
    let logStack: string | undefined;
    let logMessageDetails: string;

    const getHttpExceptionMessage = (
      excResponse: string | object,
    ): string | string[] => {
      if (
        typeof excResponse === 'object' &&
        excResponse !== null &&
        'message' in excResponse
      ) {
        return (excResponse as { message: string | string[] }).message;
      }
      return typeof excResponse === 'string'
        ? excResponse
        : (excResponse as HttpException).message;
    };

    if (exception instanceof AppException) {
      httpStatus = exception.httpStatus;
      message = exception.message;
      logMessageDetails = `AppException: ${exception.name} - ${exception.message} at ${request.url}`;
      logStack = exception.stack;

      this.logger.warn(logMessageDetails);
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = getHttpExceptionMessage(exceptionResponse);

      logMessageDetails = `HttpException: ${exception.name} - ${JSON.stringify(exceptionResponse)} at ${request.url}`;
      logStack = exception.stack;

      if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR)
        this.logger.error(logMessageDetails, logStack);
      else this.logger.warn(logMessageDetails);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      logMessageDetails = `DBEception: ${exception.name} - Code ${exception.code} - ${exception.message} at ${request.url}`;
      logStack = exception.stack;

      switch (exception.code) {
        case 'P2002': {
          httpStatus = HttpStatus.CONFLICT;

          message =
            exception.message.split('\n').pop()?.trim() ||
            'Duplicate entry detected.';
          break;
        }
        case 'P2025': {
          httpStatus = HttpStatus.NOT_FOUND;

          message =
            exception.message.split('\n').pop()?.trim() || 'Record not found.';
          break;
        }
        default: {
          httpStatus = HttpStatus.BAD_REQUEST;
          message =
            exception.message.split('\n').pop()?.trim() ||
            'Database error ocurred';
          break;
        }
      }

      this.logger.error(logMessageDetails, logStack);
    } else if (exception instanceof Error) {
      message = 'Internal server error.';
      logMessageDetails = `Unhandled Error: ${exception.name} - ${exception.message} at ${request.url}`;
      logStack = exception.stack;

      this.logger.error(logMessageDetails, logStack);
    } else {
      logMessageDetails = `Completely Unknown Error Type: ${JSON.stringify(exception)} at ${request.url}`;

      this.logger.error(logMessageDetails);
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: Array.isArray(message) ? message.join(', ') : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
