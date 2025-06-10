import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { PrismaService } from './infraestructure/database/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './infraestructure/filters/app-exception.filter';
import {
  Environment,
  EnvironmentConfig,
} from './infraestructure/config/environment.config';

export async function initApplication(): Promise<[INestApplication, any]> {
  const app = await NestFactory.create(AppModule);

  // const prismaService = app.get(PrismaService);
  // prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('RIMAC Challenge')
    .setDescription('Softek')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(
      EnvironmentConfig.NODE_ENV === Environment.local
        ? ''
        : `/${EnvironmentConfig.NODE_ENV}`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new AppExceptionFilter());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return [app, expressApp];
}
