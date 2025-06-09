import { Injectable } from '@nestjs/common';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { Custom } from 'src/domain/entites/custom.entity';
import { CreateCustomDto } from 'src/application/dtos/custom/create-custom.dto';

@Injectable()
export class CreateCustomUseCase {
  constructor(private readonly customRepository: ICustomRepository) {}

  async execute(dto: CreateCustomDto) {
    const customData = new Custom(dto);

    const createdCustomData = this.customRepository.create(customData);

    return createdCustomData;
  }
}
