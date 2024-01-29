import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MaileModule } from '../../default/mail/mail.module';
import { RedisModule } from '../../default/redis/redis.module';
import { AuthService } from '../auth/auth.service';
// import { JwtService, JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MaileModule, RedisModule],
  controllers: [AccountController],
  providers: [AccountService, AuthService],
})
export class WebAccountModule {}
