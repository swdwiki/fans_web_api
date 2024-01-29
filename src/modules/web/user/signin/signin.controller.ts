import { Body, Req, Post, Query, Get } from '@nestjs/common';
import { SigninService } from './signin.service';
import { WebRouter } from '../../../../decorator/router.decorator';

@WebRouter('signin')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post('add')
  signin(@Body() signinInfo, @Req() req) {
    return this.signinService.signin(signinInfo, req.user.userId);
  }

  @Get('list')
  getMonthSigninRecord(@Query('month') month, @Req() req) {
    return this.signinService.signinRecordByMonth(month, req.user.userId);
  }

  @Post('supply')
  signinBySupply(@Body() signinInfo, @Req() req) {
    return this.signinService.signinBySupply(signinInfo, req.user.userId);
  }
}
