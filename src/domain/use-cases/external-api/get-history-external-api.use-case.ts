import { Injectable } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { GetHistoryExternalApiDto } from '../../../application/dtos/external-api/get-history-external-api.dto';

@Injectable()
export class GetHistoryExternalApiUseCase {
  constructor(
    private readonly fusedCharacterRepository: IFusedCharacterRepository,
  ) {}

  async execute(request: GetHistoryExternalApiDto) {
    const { page, limit } = request;

    const history = await this.fusedCharacterRepository.getAll(page, limit);

    return history;
  }
}
