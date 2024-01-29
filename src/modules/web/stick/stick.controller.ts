import {
  Body,
  Controller,
  Query,
  Post,
  Get,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { StickService } from './stick.service';
import { Public } from '../../../decorator/default.decorator';
import {
  createStickClubDto,
  updateStickClubDto,
  stickClubListDto,
  createStickThemeDto,
  updateStickThemeDto,
  stickThemeListDto,
  stickListDto,
  createStickDto,
  stickCommentDto,
  stickCommentReplyDto,
  commentReplyQueryDto,
} from './dto_vo/stick.dto';
import { WebRouter } from '../../../decorator/router.decorator';

@WebRouter('stick')
export class StickController {
  constructor(private readonly stickService: StickService) {}

  // 尺牍圈子
  @Post('club/create')
  createStickClub(@Body() createStickClubForm: createStickClubDto) {
    return this.stickService.createStickClub(createStickClubForm);
  }

  @Post('club/update')
  updateStickClub(@Body() updateStickClubForm: updateStickClubDto) {
    return this.stickService.updateStickClub(updateStickClubForm);
  }

  @Post('club/delete')
  deleteStickClub(@Body('clubId') clubId: number) {
    return this.stickService.deleteStickClub(clubId);
  }

  @Public()
  @Get('club/list')
  stickClubList(@Query() stickClubListQuery: stickClubListDto) {
    return this.stickService.getStickClubList(stickClubListQuery);
  }

  @Post('theme/create')
  createStickTheme(@Body() createStickThemeForm: createStickThemeDto) {
    return this.stickService.createStickTheme(createStickThemeForm);
  }

  @Post('theme/update')
  updateStickTheme(@Body() updateStickThemeForm: updateStickThemeDto) {
    return this.stickService.updateStickTheme(updateStickThemeForm);
  }

  @Post('club/delete')
  deleteStickTheme(@Body('themeId') themeId: number) {
    return this.stickService.deleteStickTheme(themeId);
  }

  @Public()
  @Get('theme/list')
  stickThemeList(@Query() stickThemeListQuery: stickThemeListDto) {
    return this.stickService.getStickThemeList(stickThemeListQuery);
  }

  // 尺牍
  @Public()
  @Get('list')
  stickList(@Query() stickListQuery: stickListDto, @Req() req) {
    if (req.user) {
      const userId = req.user.userId;
      return this.stickService.getStickList(stickListQuery, userId);
    } else {
      return this.stickService.getStickList(stickListQuery);
    }
  }

  @Get('creator/list')
  creatorStickList(@Query() stickListQuery: stickListDto, @Req() req) {
    const userId = req.user.userId;
    return this.stickService.getCreatorStickList(stickListQuery, userId);
  }

  @Post('create')
  createStick(@Body() createStickForm: createStickDto, @Req() req) {
    const { userId } = req.user;
    return this.stickService.createStick(createStickForm, userId);
  }

  @Public()
  @Get('detail')
  getStickDetail(@Query('stickId') stickId: number, @Req() req) {
    if (req.user) {
      const userId = req.user.userId;
      return this.stickService.getStickDetail(stickId, userId);
    } else {
      return this.stickService.getStickDetail(stickId);
    }
  }

  @Delete('delete/:stickId')
  deleteStick(@Param('stickId') stickId: number, @Req() req) {
    const { userId } = req.user;
    return this.stickService.deleteStick(stickId, userId);
  }

  @Post('like')
  likeStick(@Body('stickId') stickId: number, @Req() req) {
    const { userId } = req.user;
    return this.stickService.likeStick(stickId, userId);
  }

  @Post('comment')
  commentStick(@Body() stickCommentForm: stickCommentDto, @Req() req) {
    const { userId } = req.user;
    return this.stickService.commentStick(stickCommentForm, userId);
  }

  @Public()
  @Get('comment/list')
  getStickCommentList(@Query() commentListQuery: any) {
    return this.stickService.getStickCommentList(commentListQuery);
  }

  @Post('reply')
  replyStickComment(
    @Body() stickCommentReplyForm: stickCommentReplyDto,
    @Req() req,
  ) {
    const { userId } = req.user;
    return this.stickService.replyStickComment(stickCommentReplyForm, userId);
  }

  @Public()
  @Get('recommend')
  getRecommendStickList() {
    return this.stickService.getRecommendStickList();
  }

  @Get('comment/count')
  commentCount() {
    return this.stickService.commentMessageCount();
  }

  @Public()
  @Get('comment/reply/list')
  getCommentReplyList(@Query() commentReplyQuery: commentReplyQueryDto) {
    console.log(commentReplyQuery);
    return this.stickService.getCommentReplyList(commentReplyQuery);
  }

  // @Post('reply')
  // likeStick(@Body('stickId') stickId: number, @Req() req) {
  //   const { userId } = req.user;
  //   return this.stickService.likeStick(stickId, userId);
  // }
}
