import { Module, Provider } from '@nestjs/common';
import { InfraestructureModule } from 'src/infraestructure/infraestructure.module';
import { GetFusedExternalApiUseCase } from './use-cases/external-api/get-fused-external-api.use-case';
import { GetHistoryExternalApiUseCase } from './use-cases/external-api/get-history-external-api.use-case';
import { CreateCustomUseCase } from './use-cases/custom/create-custom.use-case';
import { RegisterUserUseCase } from './use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from './use-cases/auth/login-user.use-case';

const providers: Provider[] = [
  RegisterUserUseCase,
  LoginUserUseCase,
  GetFusedExternalApiUseCase,
  GetHistoryExternalApiUseCase,
  CreateCustomUseCase,
];

@Module({
  imports: [InfraestructureModule],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class DomainModule {}
