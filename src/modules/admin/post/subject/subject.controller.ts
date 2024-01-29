import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { AdminSubjectService } from './subject.service';
import {
  CreatePostSubjectDto,
  PostSubjectDto,
  UpdatePostSubjectDto,
  PostSubjectListDataDto,
} from '../dto/post.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminRouter } from '../../../../decorator/router.decorator';
import { Admin, Public } from '../../../../decorator/default.decorator';

@Public()
@ApiTags('管理端-文章专题管理')
@AdminRouter('post/subject')
export class SubjectController {
  constructor(private readonly subjectService: AdminSubjectService) {}

  @Get('list')
  getPostSubjectList(): Promise<PostSubjectListDataDto> {
    return this.subjectService.list();
  }

  @Get(':id')
  getPostSubject(
    @Param('id') subjectId: number | string,
  ): Promise<PostSubjectDto> {
    return this.subjectService.subject(subjectId);
  }

  @Post('create')
  addPostSubjectList(
    @Body() addSubjectForm: CreatePostSubjectDto,
  ): Promise<PostSubjectDto> {
    return this.subjectService.create(addSubjectForm);
  }

  @Post('update')
  updatePostSubjectList(
    @Body() updateSubjectForm: UpdatePostSubjectDto,
  ): Promise<boolean> {
    return this.subjectService.update(updateSubjectForm);
  }

  @Delete('delete')
  deletePostSubjectList(@Body('subjectId') subjectId: number | string): any {
    return this.subjectService.delete(subjectId);
  }

  @Post('change/state')
  changePostSubjectStatus(@Body('subjectId') subjectId: number | string): any {
    return this.subjectService.changeState(subjectId);
  }

  @Post('change/sort')
  changePostTagsSort(
    @Body() changeSubjectSort: { subjectId: number | string; sort: number },
  ): Promise<boolean> {
    return this.subjectService.changeSort(changeSubjectSort);
  }
}
