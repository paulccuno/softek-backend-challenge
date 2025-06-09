import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IStarWarsService } from 'src/domain/external-services/star-wars/star-wars.api.service';
import { StarWarsApiService } from './star-wars.api.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [{ provide: IStarWarsService, useClass: StarWarsApiService }],
  exports: [IStarWarsService],
})
export class StarWarsApiModule {}
