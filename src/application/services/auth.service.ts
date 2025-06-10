import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from '../../domain/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { LoginUserDto } from '../dtos/auth/login-user.dto';

import { RefreshTokenUseCase } from '../../domain/use-cases/auth/refresh-token.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  registerUser(dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  loginUser(dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto);
  }

  refreshToken(authHeader: string) {
    return this.refreshTokenUseCase.execute(authHeader);
  }
}
