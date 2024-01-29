import { Test, TestingModule } from '@nestjs/testing';
import { AdminPlatesController } from './plates.controller';
import { AdminPlatesService } from './plates.service';

describe('PlatesController', () => {
  let controller: AdminPlatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPlatesController],
      providers: [AdminPlatesController],
    }).compile();

    controller = module.get<AdminPlatesController>(AdminPlatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
