import { Module } from '@nestjs/common';
import { WebSettingService } from './web-setting.service';
import { WebSettingController } from './web-setting.controller';

@Module({
  controllers: [WebSettingController],
  providers: [WebSettingService],
})
export class WebSettingModule {}
