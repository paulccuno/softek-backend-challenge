import { EnvironmentConfig } from './infraestructure/config/environment.config';
import { Logger } from '@nestjs/common';
import { initApplication } from './app';

async function bootstrap() {
  const [app] = await initApplication();
  await app.listen(EnvironmentConfig.PORT);
  Logger.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}`,
  );
}
bootstrap();
