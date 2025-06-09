import { Body, Controller, Post } from '@nestjs/common';
import { CreateCustomDto } from 'src/application/dtos/custom/create-custom.dto';

import { CustomService } from '../services/custom.service';

@Controller('custom')
export class CustomController {
  constructor(private readonly customService: CustomService) {}

  @Post('almacenar')
  createCustom(@Body() dto: CreateCustomDto) {
    return this.customService.createCustom(dto);
  }
}
