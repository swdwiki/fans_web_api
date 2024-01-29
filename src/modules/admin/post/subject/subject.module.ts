import { Module } from '@nestjs/common';
import { AdminSubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  controllers: [SubjectController],
  providers: [AdminSubjectService],
})
export class AdminSubjectModule {}
