import { Body, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminRouter } from '../../../decorator/router.decorator';

@ApiTags('账号&用户管理')
@AdminRouter('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('invitCode/create')
  createInvitCode(@Body() createForm: any) {
    return this.accountService.createInvitCode(createForm);
  }
}
