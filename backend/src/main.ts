import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  initializeTransactionalContext();
  const log_level:LogLevel[] = process.env.TEST === 'false' ? ['error', 'log'] : ['error', 'log', 'debug']
  const app = await NestFactory.create(AppModule, {
    logger: log_level
  });
  // for URI Versioning
  app.enableVersioning();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('42cabi v2 API')
    .setDescription('42cabi v2 API 명세')
    .setVersion('2.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const is_local = Boolean(configService.get<string>('is_local'));
  if (is_local === true) {
    app.enableCors();
  }
  app.use(helmet());
  await app.listen(port);
}
bootstrap();
