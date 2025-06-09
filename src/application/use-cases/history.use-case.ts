import { Injectable } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { HistoryDto } from '../dtos/history.dto';

@Injectable()
export class HistoryUseCase {
  constructor(
    private readonly fusedCharacterRepository: IFusedCharacterRepository,
  ) {}

  async execute(request: HistoryDto) {
    const { page, limit } = request;

    const history = await this.fusedCharacterRepository.getAll(page, limit);

    return history;
  }
}
