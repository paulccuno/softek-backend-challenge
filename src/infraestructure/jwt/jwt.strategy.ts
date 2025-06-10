import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { EnvironmentConfig } from '../config/environment.config';
import { JwtPayloadDto } from 'src/application/dtos/auth/login-user-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger: Logger;

  constructor(private readonly userRepository: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: EnvironmentConfig.JWT_SECRET,
      ignoreExpiration: false,
    });

    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.userRepository.findByUsename(payload.username);

    if (!user)
      throw new UnauthorizedException('User not found or invalid token.');

    return user;
  }
}
