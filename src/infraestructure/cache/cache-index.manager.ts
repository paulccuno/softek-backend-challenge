import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheIndexManager {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async add(indexKey: string, key: string) {
    const current: string[] = (await this.cache.get(indexKey)) || [];

    if (!current.includes(key)) {
      current.push(key);
      await this.cache.set(indexKey, current);
    }
  }

  async invalidate(indexKey: string) {
    const keys: string[] = (await this.cache.get(indexKey)) || [];

    for (const key of keys) {
      await this.cache.del(key);
    }

    await this.cache.del(indexKey);
  }
}
