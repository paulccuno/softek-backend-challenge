import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCustomDto } from 'src/application/dtos/custom/create-custom.dto';
import { CustomService } from '../services/custom.service';
import { JwtAuthGuard } from 'src/infraestructure/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from 'src/infraestructure/decorators/user.decorator';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('custom')
export class CustomController {
  constructor(private readonly customService: CustomService) {}

  @Post('almacenar')
  @ApiBearerAuth()
  createCustom(@Body() dto: CreateCustomDto, @AuthUser() user: JwtPayload) {
    return this.customService.createCustom(dto, user);
  }
}
