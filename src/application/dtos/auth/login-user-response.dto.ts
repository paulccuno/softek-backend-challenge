import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { User } from 'src/domain/entites/user.entity';

export class LoginUserResponseDto {
  @ApiProperty({ type: User })
  @Type(() => User)
  user: User;

  @ApiProperty()
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}
