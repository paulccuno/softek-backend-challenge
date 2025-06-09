import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentConfig } from 'src/infraestructure/config/environment.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: EnvironmentConfig.JWT_SECRET,
        signOptions: {
          expiresIn: EnvironmentConfig.JWT_EXPIRATION,
        },
      }),
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class JwtAuthModule {}
