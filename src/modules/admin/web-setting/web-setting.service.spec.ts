import { Test, TestingModule } from '@nestjs/testing';
import { WebSettingService } from './web-setting.service';

describe('WebSettingService', () => {
  let service: WebSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebSettingService],
    }).compile();

    service = module.get<WebSettingService>(WebSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
