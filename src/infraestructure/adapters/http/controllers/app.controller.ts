import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FusedUseCase } from '../../../../application/use-cases/fused.use-case';
import { HistoryDto } from 'src/application/dtos/history.dto';
import { HistoryUseCase } from 'src/application/use-cases/history.use-case';
import { StoreDto } from 'src/application/dtos/store.dto';
import { StoreUseCase } from '../../../../application/use-cases/store.use-case';

@Controller()
export class AppController {
  constructor(
    private readonly fusedUseCase: FusedUseCase,
    private readonly historyUseCase: HistoryUseCase,
    private readonly storeUseCase: StoreUseCase,
  ) {}

  @Get('fusionados')
  getFusedData(): Promise<any> {
    return this.fusedUseCase.execute();
  }

  @Get('historial')
  getHistoryData(@Query() dto: HistoryDto): Promise<any> {
    return this.historyUseCase.execute(dto);
  }

  @Post('almacenar')
  store(@Body() dto: StoreDto) {
    return this.storeUseCase.execute(dto);
  }
}
