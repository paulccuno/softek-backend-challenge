import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensResponseDto } from 'src/application/dtos/auth/login-user-response.dto';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(authHeader: string) {
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException(
        'Missing or malformed Authorization header.',
      );

    const token = authHeader.replace('Bearer ', '').trim();

    const decoded: JwtPayload = this.jwtService.decode(token);

    if (!decoded || typeof decoded !== 'object') {
      throw new UnauthorizedException('Invalid token');
    }

    const { sub, username, roles } = decoded;
    const payload: JwtPayload = { sub, username, roles };

    const response: TokensResponseDto = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: EnvironmentConfig.JWT_REFRESH_EXPIRATION,
      }),
    };

    return response;
  }
}
