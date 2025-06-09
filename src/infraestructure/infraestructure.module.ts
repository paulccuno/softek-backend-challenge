import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from './jwt/jwt.module';
import { AppCacheModule } from './cache/cache.module';
import { StarWarsApiModule } from './external-services/swapi/star-wars.api.module';
import { RickAndMortyApiModule } from './external-services/rick-and-morty/rick-and-morty.api.module';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtAuthModule,
    AppCacheModule,
    StarWarsApiModule,
    RickAndMortyApiModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [
    PrismaModule,
    PassportModule,
    JwtAuthModule,
    AppCacheModule,
    StarWarsApiModule,
    RickAndMortyApiModule,
  ],
})
export class InfraestructureModule {}
