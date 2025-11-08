import { Test, TestingModule } from '@nestjs/testing';
import { NekosService } from './nekos.service';

describe('NekosService', () => {
  let service: NekosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NekosService],
    }).compile();

    service = module.get<NekosService>(NekosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
