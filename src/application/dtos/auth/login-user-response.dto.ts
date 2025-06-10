import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { User } from 'src/domain/entites/user.entity';

export class JwtPayloadDto {
  @ApiProperty()
  sub: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  roles: string[];
}

export class TokensResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LoginUserResponseDto {
  @ApiProperty({ type: User })
  @Type(() => User)
  user: User;

  @ApiProperty({ type: TokensResponseDto })
  @Type(() => TokensResponseDto)
  tokens: TokensResponseDto;
}
