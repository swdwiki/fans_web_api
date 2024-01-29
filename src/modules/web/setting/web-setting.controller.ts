import { Controller } from '@nestjs/common';
import { WebSettingService } from './web-setting.service';

@Controller('web-setting')
export class WebSettingController {
  constructor(private readonly webSettingService: WebSettingService) {}
}
