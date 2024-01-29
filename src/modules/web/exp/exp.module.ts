import { Module } from '@nestjs/common';
import { ExpService } from './exp.service';
import { ExpController } from './exp.controller';

@Module({
  controllers: [ExpController],
  providers: [ExpService],
  exports: [ExpService],
})
export class WebExpModule {}
