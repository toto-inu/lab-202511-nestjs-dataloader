import { Test, TestingModule } from '@nestjs/testing';
import { InusResolver } from './inus.resolver';
import { InusService } from './inus.service';

describe('InusResolver', () => {
  let resolver: InusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InusResolver, InusService],
    }).compile();

    resolver = module.get<InusResolver>(InusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
