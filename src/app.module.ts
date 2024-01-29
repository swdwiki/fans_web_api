import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules, providers } from './modules/index.module';
import logger from './core/middleware/logger.middleware';

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService, ...providers],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
