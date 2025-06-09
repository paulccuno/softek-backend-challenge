import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IRickAndMortyService } from 'src/domain/external-services/rick-and-morty/rick-and-morty.api.service';
import { RickAndMortyApiService } from './rick-and-morty.api.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    {
      provide: IRickAndMortyService,
      useClass: RickAndMortyApiService,
    },
  ],
  exports: [IRickAndMortyService],
})
export class RickAndMortyApiModule {}
