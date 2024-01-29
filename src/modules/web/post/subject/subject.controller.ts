import { Controller, Get } from '@nestjs/common';
import { WebSubjectService } from './subject.service';
import { WebRouter } from '../../../../decorator/router.decorator';
import { Public } from '../../../../decorator/default.decorator';

@WebRouter('post/subject')
export class SubjectController {
  constructor(private readonly subjectService: WebSubjectService) {}

  @Public()
  @Get('list')
  getPostSubjectList(): any {
    return this.subjectService.list();
  }
}
