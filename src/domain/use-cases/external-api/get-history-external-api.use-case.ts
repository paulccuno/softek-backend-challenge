import { Inject, Injectable } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { GetHistoryExternalApiDto } from '../../../application/dtos/external-api/get-history-external-api.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEY } from 'src/infraestructure/cache/constants';
import { CacheIndexManager } from 'src/infraestructure/cache/cache-index.manager';

@Injectable()
export class GetHistoryExternalApiUseCase {
  constructor(
    private readonly fusedCharacterRepository: IFusedCharacterRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly cacheIndexManager: CacheIndexManager,
  ) {}

  async execute(request: GetHistoryExternalApiDto) {
    const { limit, pageToken } = request;

    const key = `${CACHE_KEY.getHistoryExternalApi}:page=${pageToken}:limit=${limit}`;
    const cached = await this.cache.get(key);

    if (cached) return cached;

    const history = await this.fusedCharacterRepository.getAll(
      limit,
      pageToken,
    );

    const indexKey = `${CACHE_KEY.getHistoryExternalApi}:index`;
    await this.cacheIndexManager.add(indexKey, key);

    await this.cache.set(key, history);

    return history;
  }
}
