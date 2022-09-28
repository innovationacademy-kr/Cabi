import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const is_local: boolean = Boolean(configService.get<string>('is_local'));
  if (is_local === true) {
    app.enableCors();
  }
  await app.listen(port);
}
bootstrap();
