import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../jwt/jwt.strategy';

export const AuthUser = createParamDecorator(
  (data, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();

    const user: JwtPayload = request.user;

    return user;
  },
);
