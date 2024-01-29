import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { LoginLogService } from './loginLog.service';

@Controller('default/login/log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Post('create')
  createLoginLog(@Body('accountId') accountId) {
    return this.loginLogService.create(accountId);
  }

  @Get('list')
  getLoginLogList(@Query() loginLogQuery) {
    return this.loginLogService.list(loginLogQuery);
  }
}
