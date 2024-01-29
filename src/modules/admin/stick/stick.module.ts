import { Module } from '@nestjs/common';
import { StickService } from './stick.service';
import { StickController } from './stick.controller';

@Module({
  controllers: [StickController],
  providers: [StickService]
})
export class StickModule {}
