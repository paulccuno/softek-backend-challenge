import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './infraestructure/config/environment.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './infraestructure/persistence/prisma/prisma.service';
import { AppExceptionFilter } from './infraestructure/common/filters/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Visor')
    .setDescription(
      'API documentation for NestJS project with Hexagonal Architecture and DDD',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(EnvironmentConfig.PORT);
  Logger.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}`,
  );
}
bootstrap();
