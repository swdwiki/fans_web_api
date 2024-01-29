import { Test, TestingModule } from '@nestjs/testing';
import { WebPlatesService } from './plates.service';

describe('PlatesService', () => {
  let service: WebPlatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebPlatesService],
    }).compile();

    service = module.get<WebPlatesService>(WebPlatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
