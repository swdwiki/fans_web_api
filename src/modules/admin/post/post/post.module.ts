import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AdminSubjectModule } from '../subject/subject.module';
import { AdminPlatesModule } from '../plates/plates.module';
import { AdminTagsModule } from '../tags/tags.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [AdminSubjectModule, AdminPlatesModule, AdminTagsModule],
})
export class AdminPostModule {}
