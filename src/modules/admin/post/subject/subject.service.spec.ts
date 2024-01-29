import { Test, TestingModule } from '@nestjs/testing';
import { AdminSubjectService } from './subject.service';

describe('SubjectService', () => {
  let service: AdminSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSubjectService],
    }).compile();

    service = module.get<AdminSubjectService>(AdminSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
