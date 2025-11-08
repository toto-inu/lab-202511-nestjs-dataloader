import { Test, TestingModule } from '@nestjs/testing';
import { NekosResolver } from './nekos.resolver';
import { NekosService } from './nekos.service';

describe('NekosResolver', () => {
  let resolver: NekosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NekosResolver, NekosService],
    }).compile();

    resolver = module.get<NekosResolver>(NekosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
