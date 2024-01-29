import { Module } from '@nestjs/common';
import { WebPlatesService } from './plates.service';
import { WebPlatesController } from './plates.controller';

@Module({
  controllers: [WebPlatesController],
  providers: [WebPlatesService],
})
export class WebPlatesModule {}
