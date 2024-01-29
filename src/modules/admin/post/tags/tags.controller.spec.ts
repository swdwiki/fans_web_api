import { Test, TestingModule } from '@nestjs/testing';
import { AdminTagsController } from './tags.controller';
import { AdminTagsService } from './tags.service';

describe('TagsController', () => {
  let controller: AdminTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTagsController],
      providers: [AdminTagsController],
    }).compile();

    controller = module.get<AdminTagsController>(AdminTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
