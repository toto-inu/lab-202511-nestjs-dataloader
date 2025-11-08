import { Test, TestingModule } from '@nestjs/testing';
import { InusService } from './inus.service';

describe('InusService', () => {
  let service: InusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InusService],
    }).compile();

    service = module.get<InusService>(InusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
