import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/application/dtos/auth/login-user.dto';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { AppException } from 'src/infraestructure/exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { LoginUserResponseDto } from 'src/application/dtos/auth/login-user-response.dto';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';

@Injectable()
export class LoginUserUseCase {
  private readonly logger: Logger;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

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

    const response: LoginUserResponseDto = {
      user,
      tokens: {
        accessToken: this.jwtService.sign(rest),
        refreshToken: this.jwtService.sign(rest, {
          expiresIn: EnvironmentConfig.JWT_REFRESH_EXPIRATION,
        }),
      },
    };

    return response;
  }
}
