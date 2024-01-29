import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { defaultConfig } from '../../../config/default.config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: defaultConfig.redis.redis_server_host,
            port: defaultConfig.redis.redis_server_port,
          },
          database: defaultConfig.redis.redis_server_db,
          password: defaultConfig.redis.redis_server_password,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
