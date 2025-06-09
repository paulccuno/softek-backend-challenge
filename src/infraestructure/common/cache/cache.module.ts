import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-yet';
import { EnvironmentConfig } from '../../config/environment.config';

const redisHost = EnvironmentConfig.REDIS_HOST;
const redisPort = EnvironmentConfig.REDIS_PORT;
const redisPassword = EnvironmentConfig.REDIS_PASSWORD;
const defaultTtl = EnvironmentConfig.CACHE_DEFAULT_TTL;

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisHost,
      port: redisPort,
      password: redisPassword ? redisPassword : undefined,
      ttl: defaultTtl,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}

Logger.log(
  `CacheModule connecting to Redis: ${redisHost}:${redisPort}, TTL: ${defaultTtl}s`,
  AppCacheModule.name,
);
