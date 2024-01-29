import { Module } from '@nestjs/common';
import { AdminPlatesService } from './plates.service';
import { AdminPlatesController } from './plates.controller';

@Module({
  controllers: [AdminPlatesController],
  providers: [AdminPlatesService],
})
export class AdminPlatesModule {}
