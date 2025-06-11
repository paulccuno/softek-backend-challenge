import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetHistoryExternalApiDto {
  // @ApiProperty({ default: 1 })
  // @IsNumber()
  // @IsOptional()
  // @Min(1)
  // @Type(() => Number)
  // page: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  pageToken?: string;
}
