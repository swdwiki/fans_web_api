import { Body, Controller, Get, Post, Delete, Query } from '@nestjs/common';
import { AdminTagsService } from './tags.service';
import {
  TagsDto,
  CreateTagsDto,
  UpdateTagsDto,
  TagListQueryDto,
  TagListDataDto,
} from '../dto/post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminRouter } from '../../../../decorator/router.decorator';
import { Public } from '../../../../decorator/default.decorator';

@Public()
@ApiTags('管理端-文章标签管理')
@AdminRouter('post/tag')
export class AdminTagsController {
  constructor(private readonly tagsService: AdminTagsService) {}

  @Get('list')
  getTagsList(@Query() tagListQuery: TagListQueryDto): Promise<TagListDataDto> {
    return this.tagsService.list(tagListQuery);
  }

  @Post('create')
  addTagsList(@Body() addTagsForm: CreateTagsDto): Promise<TagsDto> {
    return this.tagsService.create(addTagsForm);
  }

  @Post('update')
  updatePostTagsList(@Body() updateTagsForm: UpdateTagsDto): Promise<boolean> {
    return this.tagsService.update(updateTagsForm);
  }

  @Delete('delete')
  deletePostTagsList(@Query('tagId') tagId: number | string): any {
    return this.tagsService.delete(tagId);
  }

  @Post('change/state')
  changePostTagsStatus(@Body('tagsId') tagsId): any {
    return this.tagsService.changeState(tagsId);
  }

  @Post('change/sort')
  changePostTagsSort(
    @Body() changeTagSort: { tagId: number | string; sort: number },
  ): Promise<boolean> {
    return this.tagsService.changeSort(changeTagSort);
  }
}
