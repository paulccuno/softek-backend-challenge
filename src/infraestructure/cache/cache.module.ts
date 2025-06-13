import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { EnvironmentConfig } from '../config/environment.config';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { CacheIndexManager } from './cache-index.manager';

const redisHost = EnvironmentConfig.REDIS_HOST;
const redisPort = EnvironmentConfig.REDIS_PORT;
const redisPassword = EnvironmentConfig.REDIS_PASSWORD;
const defaultTtl = EnvironmentConfig.CACHE_DEFAULT_TTL;

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        stores: [
          new Keyv({
            store: new CacheableMemory({ ttl: defaultTtl }),
          }),
          createKeyv(
            redisPassword
              ? `redis://default:${redisPassword}@${redisHost}:${redisPort}`
              : `redis://${redisHost}:${redisPort}`,
          ),
        ],
      }),
    }),
  ],
  providers: [CacheIndexManager],
  exports: [CacheModule, CacheIndexManager],
})
export class AppCacheModule {}

Logger.log(
  `CacheModule connecting to Redis: ${redisHost}:${redisPort}, TTL: ${defaultTtl}s`,
  AppCacheModule.name,
);
