import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { LoginUserDto } from '../dtos/auth/login-user.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  loginUser(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiParam({ name: 'Authorization', required: false })
  refreshToken(@Headers('Authorization') authorization: string) {
    return this.authService.refreshToken(authorization);
  }
}
