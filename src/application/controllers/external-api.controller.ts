import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExternalApiService } from '../services/external-api.service';
import { GetHistoryExternalApiDto } from '../dtos/external-api/get-history-external-api.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/infraestructure/jwt/jwt-auth.guard';
import { Public } from 'src/infraestructure/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('external-api')
export class ExternalApiController {
  constructor(
    private readonly externalApiService: ExternalApiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('fusionados')
  getFusedExternalApi() {
    return this.externalApiService.getFusedExternalApi();
  }

  @Public()
  @Get('historial')
  @UseInterceptors(CacheInterceptor)
  getHistoryExternalApi(@Query() dto: GetHistoryExternalApiDto) {
    return this.externalApiService.getHistoryExternalApi(dto);
  }
}
