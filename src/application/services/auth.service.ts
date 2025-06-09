import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from '../../domain/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../domain/use-cases/auth/login-user.use-case';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { LoginUserDto } from '../dtos/auth/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  registerUser(dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  loginUser(dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto);
  }
}
