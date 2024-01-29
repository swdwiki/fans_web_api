import { Test, TestingModule } from '@nestjs/testing';
import { AdminTagsService } from './tags.service';

describe('AdminTagsService', () => {
  let service: AdminTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminTagsService],
    }).compile();

    service = module.get<AdminTagsService>(AdminTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
