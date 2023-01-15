import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common';
import { initializeTransactionalContext } from './transaction/src/common.transaction';

async function bootstrap() {
  initializeTransactionalContext();
  const log_level: LogLevel[] =
    process.env.DEBUG_LOG === 'false'
      ? ['error', 'log']
      : ['error', 'log', 'debug'];
  const app = await NestFactory.create(AppModule, {
    logger: log_level,
  });
  // for URI Versioning
  app.enableVersioning();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cabi API')
    .setDescription('Cabi API 명세')
    .setVersion('4.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors({
    origin: process.env.FE_HOST,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
