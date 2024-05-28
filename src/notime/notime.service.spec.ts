import { Test, TestingModule } from '@nestjs/testing';
import { NotimeService } from './notime.service';

describe('NotimeService', () => {
  let service: NotimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotimeService],
    }).compile();

    service = module.get<NotimeService>(NotimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
