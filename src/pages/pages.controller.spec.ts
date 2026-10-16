import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller.js';
import { PagesService } from './pages.service.js';

describe('PagesController', () => {
  let controller: PagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [PagesService],
    }).compile();

    controller = module.get<PagesController>(PagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
