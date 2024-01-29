import { Test, TestingModule } from '@nestjs/testing';
import { AdminPlatesService } from './plates.service';

describe('AdminPlatesService', () => {
  let service: AdminPlatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPlatesService],
    }).compile();

    service = module.get<AdminPlatesService>(AdminPlatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
