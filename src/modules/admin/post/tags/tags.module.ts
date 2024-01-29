import { Module } from '@nestjs/common';
import { AdminTagsService } from './tags.service';
import { AdminTagsController } from './tags.controller';

@Module({
  controllers: [AdminTagsController],
  providers: [AdminTagsService],
})
export class AdminTagsModule {}
