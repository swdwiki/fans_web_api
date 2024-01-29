import { Body, Controller, Get, Post, Delete, Query } from '@nestjs/common';
import { AdminPlatesService } from './plates.service';
import {
  PostPlatesDto,
  CreatePostPlatesDto,
  UpdatePostPlatesDto,
  PostPlateListQueryDto,
  PostPlateListDataDto,
} from '../dto/post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminRouter } from '../../../../decorator/router.decorator';
import { Admin, Public } from '../../../../decorator/default.decorator';

@Public()
@ApiTags('文章板块（圈子）')
@AdminRouter('post/plate')
export class AdminPlatesController {
  constructor(private readonly plateService: AdminPlatesService) {}

  @Get('list')
  getPostPlatesList(
    @Query() plateListQuery: PostPlateListQueryDto,
  ): Promise<PostPlateListDataDto> {
    return this.plateService.list(plateListQuery);
  }

  @Post('create')
  addPostPlatesList(
    @Body() addPlatesForm: CreatePostPlatesDto,
  ): Promise<PostPlatesDto> {
    return this.plateService.create(addPlatesForm);
  }

  @Post('update')
  updatePostPlatesList(
    @Body() updatePlatesForm: UpdatePostPlatesDto,
  ): Promise<boolean> {
    return this.plateService.update(updatePlatesForm);
  }

  @Delete('delete')
  deletePostPlatesList(@Query('plateId') plateId: number | string): any {
    return this.plateService.delete(plateId);
  }

  @Post('change/state')
  changePostPlatesStatus(@Body('tagsId') tagsId): any {
    return this.plateService.changeState(tagsId);
  }

  @Post('change/sort')
  changePostPlatesSort(
    @Body() changePlateSort: { plateId: number | string; sort: number },
  ): Promise<boolean> {
    return this.plateService.changeSort(changePlateSort);
  }
}
