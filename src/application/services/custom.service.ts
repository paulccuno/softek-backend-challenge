import { Injectable } from '@nestjs/common';
import { CreateCustomDto } from '../dtos/custom/create-custom.dto';
import { CreateCustomUseCase } from '../../domain/use-cases/custom/create-custom.use-case';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';

@Injectable()
export class CustomService {
  constructor(private readonly createCustomUseCase: CreateCustomUseCase) {}

  createCustom(dto: CreateCustomDto, user: JwtPayload) {
    return this.createCustomUseCase.execute(dto, user);
  }
}
