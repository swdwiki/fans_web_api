import { Module } from '@nestjs/common';
import { StickService } from './stick.service';
import { StickController } from './stick.controller';
import { WebExpModule } from '../exp/exp.module';

@Module({
  controllers: [StickController],
  providers: [StickService],
  imports: [WebExpModule],
})
export class WebStickModule {}
