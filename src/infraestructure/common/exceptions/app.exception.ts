import { HttpStatus } from '@nestjs/common';

export class AppException extends Error {
  constructor(
    message: string,
    public readonly httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);

    this.name = AppException.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
