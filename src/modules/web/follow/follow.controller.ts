import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowFormDto } from './dto_vo/follow.dto';
import { WebRouter } from '../../../decorator/router.decorator';

@WebRouter('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('action')
  actionFollow(@Body() followForm: FollowFormDto, @Req() req) {
    const { userId } = req.user;
    return this.followService.actionFollow(followForm, userId);
  }

  // @Get('list')
  // getMyFollowList() {}
}
