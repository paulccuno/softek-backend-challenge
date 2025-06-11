import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/application/dtos/auth/login-user.dto';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { AppException } from 'src/infraestructure/exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { LoginUserResponseDto } from 'src/application/dtos/auth/login-user-response.dto';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';
import { User } from 'src/domain/entites/user.entity';
import { JwtPayload } from 'src/infraestructure/jwt/jwt.strategy';

@Injectable()
export class LoginUserUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(LoginUserUseCase.name);
  }

  async execute(dto: LoginUserDto): Promise<LoginUserResponseDto> {
    const user = await this.userRepository.findByUsename(dto.username);

    if (!user)
      throw new AppException(
        `User with username ${dto.username} not found.`,
        HttpStatus.NOT_FOUND,
      );

    const validatePassword = await bcrypt.compare(dto.password, user.password);

    if (!validatePassword)
      throw new AppException('Password is incorrect.', HttpStatus.UNAUTHORIZED);

    const { password, ...rest } = user;

    const payload: JwtPayload = {
      sub: user.id as string,
      username: user.username,
      roles: user.roles,
    };

    const response: LoginUserResponseDto = {
      user: new User(rest),
      tokens: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: EnvironmentConfig.JWT_REFRESH_EXPIRATION,
        }),
      },
    };

    return response;
  }
}
