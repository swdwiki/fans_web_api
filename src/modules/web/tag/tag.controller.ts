import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { WebRouter } from '../../../decorator/router.decorator';
import { TagListDataDto, TagListQueryDto } from '../../dto_vo/tag/tag.dto';
import { Public } from '../../../decorator/default.decorator';

@WebRouter('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get('list')
  getTagList(@Query() tagListQuery: TagListQueryDto): Promise<TagListDataDto> {
    return this.tagService.list(tagListQuery);
  }
}
