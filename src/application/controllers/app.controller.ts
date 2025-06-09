import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetFusedExternalApiUseCase } from '../../domain/use-cases/external-api/get-fused-external-api.use-case';
import { GetHistoryExternalApiDto } from 'src/application/dtos/external-api/get-history-external-api.dto';
import { GetHistoryExternalApiUseCase } from 'src/domain/use-cases/external-api/get-history-external-api.use-case';
import { CreateCustomDto } from 'src/application/dtos/custom/create-custom.dto';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateCustomUseCase } from '../../domain/use-cases/custom/create-custom.use-case';

@Controller()
export class AppController {
  constructor(
    private readonly fusedUseCase: GetFusedExternalApiUseCase,
    private readonly historyUseCase: GetHistoryExternalApiUseCase,
    private readonly storeUseCase: CreateCustomUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('fusionados')
  async getFusedData(): Promise<any> {
    const store = this.cacheManager.stores[0];
    console.log({ cache: this.cacheManager });
    console.log({ store });

    const keysToInvalidate = await store.get('/api/historial*');
    console.log({ keysToInvalidate });

    for (const key of keysToInvalidate) {
      console.log({ key });
    }

    return this.fusedUseCase.execute();
  }

  @Get('historial')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  getHistoryData(@Query() dto: GetHistoryExternalApiDto): Promise<any> {
    return this.historyUseCase.execute(dto);
  }

  @Post('almacenar')
  store(@Body() dto: CreateCustomDto) {
    return this.storeUseCase.execute(dto);
  }
}
