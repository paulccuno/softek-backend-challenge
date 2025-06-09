import { Injectable } from '@nestjs/common';
import { GetFusedExternalApiUseCase } from '../../domain/use-cases/external-api/get-fused-external-api.use-case';
import { GetHistoryExternalApiUseCase } from '../../domain/use-cases/external-api/get-history-external-api.use-case';
import { GetHistoryExternalApiDto } from '../dtos/external-api/get-history-external-api.dto';

@Injectable()
export class ExternalApiService {
  constructor(
    private readonly getFusedExternalApiUseCase: GetFusedExternalApiUseCase,
    private readonly getHistoryExternalApiUseCase: GetHistoryExternalApiUseCase,
  ) {}

  getFusedExternalApi() {
    return this.getFusedExternalApiUseCase.execute();
  }

  getHistoryExternalApi(dto: GetHistoryExternalApiDto) {
    return this.getHistoryExternalApiUseCase.execute(dto);
  }
}
