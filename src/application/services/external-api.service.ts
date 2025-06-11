import { Injectable } from '@nestjs/common';
import { GetFusedExternalApiUseCase } from '../../domain/use-cases/external-api/get-fused-external-api.use-case';
import { GetHistoryExternalApiUseCase } from '../../domain/use-cases/external-api/get-history-external-api.use-case';
import { GetHistoryExternalApiDto } from '../dtos/external-api/get-history-external-api.dto';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';

@Injectable()
export class ExternalApiService {
  constructor(
    private readonly getFusedExternalApiUseCase: GetFusedExternalApiUseCase,
    private readonly getHistoryExternalApiUseCase: GetHistoryExternalApiUseCase,
  ) {}

  getFusedExternalApi(user: JwtPayload) {
    return this.getFusedExternalApiUseCase.execute(user);
  }

  getHistoryExternalApi(dto: GetHistoryExternalApiDto) {
    return this.getHistoryExternalApiUseCase.execute(dto);
  }
}
