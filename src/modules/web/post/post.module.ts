import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { WebSubjectModule } from './subject/subject.module';
import { WebExpModule } from '../exp/exp.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [WebSubjectModule, WebExpModule],
})
export class WebPostModule {}
