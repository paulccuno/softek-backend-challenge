import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayloadDto,
  TokensResponseDto,
} from 'src/application/dtos/auth/login-user-response.dto';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(authHeader: string) {
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException(
        'Missing or malformed Authorization header.',
      );

    const token = authHeader.replace('Bearer ', '').trim();

    const decoded: JwtPayloadDto = this.jwtService.decode(token);

    if (!decoded || typeof decoded !== 'object') {
      throw new UnauthorizedException('Invalid token');
    }

    const { sub, username, roles } = decoded;
    const payload: JwtPayloadDto = { sub, username, roles };

    const response: TokensResponseDto = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: EnvironmentConfig.JWT_REFRESH_EXPIRATION,
      }),
    };

    return response;
  }
}
