import { Module } from '@nestjs/common';
import { LoginLogService } from './loginLog.service';
import { LoginLogController } from './loginLog.controller';

@Module({
  controllers: [LoginLogController],
  providers: [LoginLogService],
})
export class LoginLogModule {}
