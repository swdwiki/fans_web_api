import { Test, TestingModule } from '@nestjs/testing';
import { WebPlatesController } from './plates.controller';
import { WebPlatesService } from './plates.service';

describe('PlatesController', () => {
  let controller: WebPlatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebPlatesController],
      providers: [WebPlatesService],
    }).compile();

    controller = module.get<WebPlatesController>(WebPlatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
