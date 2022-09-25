import { Test, TestingModule } from '@nestjs/testing';
import { CoreapiService } from './coreapi.service';

describe('CoreapiService', () => {
  let service: CoreapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreapiService],
    }).compile();

    service = module.get<CoreapiService>(CoreapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
