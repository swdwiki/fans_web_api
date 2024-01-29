import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../../decorator/default.decorator';
import { WebRouter } from '../../../decorator/router.decorator';
import { creatorListQueryDto } from './dto_vo/user.dto';

@WebRouter('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('creator/data')
  getCreatorData(@Req() req) {
    const { userId } = req.user;
    return this.userService.getCreatorData(userId);
  }

  @Get('creator/submit/new/list')
  getCreatorNewSubmitList(@Req() req) {
    const { userId } = req.user;
    return this.userService.getCreatorNewSubmitList(userId);
  }

  @Get('center/signin/count')
  getUserCenterSignCount(@Req() req) {
    const { userId } = req.user;
    return this.userService.getUserCenterSignCount(userId);
  }

  @Get('center/level')
  getUserCenterLevel(@Req() req) {
    const { userId } = req.user;
    return this.userService.getUserCenterLevel(userId);
  }

  @Get('center/growth/task')
  getGrowthTaskProcess(@Req() req) {
    const { userId } = req.user;
    return this.userService.getGrowthTaskProcess(userId);
  }

  @Get('growth/task/first')
  getFirstTaskProcess(@Req() req) {
    const { userId } = req.user;
    return this.userService.getFirstTaskProcess(userId);
  }

  @Public()
  @Get('creator/list')
  getUserCenterCreatorList(
    @Query() creatorListQuery: creatorListQueryDto,
    @Req() req,
  ) {
    if (req.user) {
      return this.userService.getUserCenterCreatorList(
        creatorListQuery,
        req.user.userId,
      );
    } else {
      return this.userService.getUserCenterCreatorList(creatorListQuery);
    }
  }

  @Public()
  @Get('center/index/data')
  getUserCenterIndexData(@Query('userId') userId, @Req() req) {
    if (req.user) {
      return this.userService.getUserCenterIndexData(userId, req.user.userId);
    } else {
      return this.userService.getUserCenterIndexData(userId);
    }
  }

  // @Get('center/index/list')
  // getUserCenterIndexList(@Query('type') userId, @Req() req) {
  //   return this.userService.getUserCenterIndexData(userId);
  // }
}
