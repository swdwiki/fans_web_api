import { Test, TestingModule } from '@nestjs/testing';
import { WebSettingController } from './web-setting.controller';
import { WebSettingService } from './web-setting.service';

describe('WebSettingController', () => {
  let controller: WebSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebSettingController],
      providers: [WebSettingService],
    }).compile();

    controller = module.get<WebSettingController>(WebSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
