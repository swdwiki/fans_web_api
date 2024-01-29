import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './core/filters/http-exception.filter';
// import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { defaultConfig } from './config/default.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('轩辕天书API')
    .setDescription('轩辕天书API文档')
    .setVersion('1.0')
    .addTag('SWDWIKI')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();
  app.use('/file', serveStatic(path.join(__dirname, '../file')));
  app.setGlobalPrefix('v1/api');
  SwaggerModule.setup('api/doc', app, document);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, '..', 'upload/file'), {
    prefix: '/file',
  });
  // app.useGlobalInterceptors(new TransformInterceptor());
  return app.listen(defaultConfig.nest_server_port);
}

export default bootstrap;
