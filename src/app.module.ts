import { Module } from '@nestjs/common';
import { PrismaModule } from './infraestructure/persistence/prisma/prisma.module';
import { AppController } from './infraestructure/adapters/http/controllers/app.controller';
import { FusedUseCase } from './application/use-cases/fused.use-case';
import { StarWarsApiModule } from './infraestructure/external-services/swapi/star-wars.api.module';
import { RickAndMortyApiModule } from './infraestructure/external-services/rick-and-morty/rick-and-morty.api.module';
import { HistoryUseCase } from './application/use-cases/history.use-case';
import { StoreUseCase } from './application/use-cases/store.use-case';
import { AppCacheModule } from './infraestructure/common/cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    AppCacheModule,
    StarWarsApiModule,
    RickAndMortyApiModule,
  ],
  controllers: [AppController],
  providers: [FusedUseCase, HistoryUseCase, StoreUseCase],
  exports: [],
})
export class AppModule {}
