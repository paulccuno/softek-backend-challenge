import { Injectable } from '@nestjs/common';
import { StoreDto } from '../dtos/store.dto';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { Custom } from 'src/domain/entites/custom.entity';

@Injectable()
export class StoreUseCase {
  constructor(private readonly customRepository: ICustomRepository) {}

  async execute(dto: StoreDto) {
    const customData = new Custom(dto);

    const createdCustomData = this.customRepository.create(customData);

    return createdCustomData;
  }
}
