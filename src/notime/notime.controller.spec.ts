import { Test, TestingModule } from '@nestjs/testing';
import { NotimeController } from './notime.controller';

describe('NotimeController', () => {
  let controller: NotimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotimeController],
    }).compile();

    controller = module.get<NotimeController>(NotimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
