import { Module, Provider } from '@nestjs/common';
import { ExternalApiService } from './services/external-api.service';
import { CustomService } from './services/custom.service';
import { ExternalApiController } from './controllers/external-api.controller';
import { CustomController } from './controllers/custom.controller';
import { DomainModule } from 'src/domain/domain.module';
import { InfraestructureModule } from 'src/infraestructure/infraestructure.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

const providers: Provider[] = [AuthService, ExternalApiService, CustomService];

@Module({
  imports: [DomainModule, InfraestructureModule],
  controllers: [AuthController, ExternalApiController, CustomController],
  providers: providers,
  exports: providers,
})
export class ApplicationModule {}
