import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  username: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
