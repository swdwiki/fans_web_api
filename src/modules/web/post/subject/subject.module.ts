import { Module } from '@nestjs/common';
import { WebSubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  controllers: [SubjectController],
  providers: [WebSubjectService],
})
export class WebSubjectModule {}
