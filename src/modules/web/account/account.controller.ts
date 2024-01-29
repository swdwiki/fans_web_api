import { Post, Body, Get, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  RegisterAccountDto,
  LoginAccountDto,
  changeMailDto,
  changePswDto,
  changeProfileDto,
  updateAvatarDto,
} from './dto_vo/account.dto';
import { WebRouter } from '../../../decorator/router.decorator';
// import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../../decorator/default.decorator';

@WebRouter('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post('getcode')
  setEmailCode(@Body() sendMailInfo) {
    return this.accountService.setMailCode(sendMailInfo);
  }

  @Public()
  @Post('reg')
  regAccount(@Body() regAccountForm: RegisterAccountDto) {
    return this.accountService.reg(regAccountForm);
  }

  @Public()
  @Post('login')
  loginAccount(@Body() loginForm: LoginAccountDto) {
    return this.accountService.login(loginForm);
  }

  @Public()
  @Post('refreshToken')
  getRefreshToken(@Body('refreshToken') refreshToken: string) {
    return this.accountService.getRefreshToken(refreshToken);
  }

  @Post('change/email')
  changeMail(@Body() changeMailForm: changeMailDto, @Req() req) {
    const { accountId } = req.user;
    return this.accountService.changeMail(changeMailForm, accountId);
  }

  @Post('change/password')
  changePassword(@Body() changePasswordForm: changePswDto, @Req() req) {
    const { accountId } = req.user;
    return this.accountService.changePassword(changePasswordForm, accountId);
  }

  @Post('update/profile')
  updateProfile(@Body() changeProfileForm: changeProfileDto, @Req() req) {
    const { userId } = req.user;
    return this.accountService.updateProfile(changeProfileForm, userId);
  }

  @Post('update/avatar')
  updateAvatar(@Body() changeAvatarForm: updateAvatarDto, @Req() req) {
    const { userId } = req.user;
    return this.accountService.updateAvatar(changeAvatarForm, userId);
  }

  @Get('userinfo')
  getUserInfo(@Req() req) {
    const user = req.user;
    return this.accountService.getUserInfo(user);
  }
}
