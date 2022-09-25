import { Test, TestingModule } from '@nestjs/testing';
import { CoreapiController } from './coreapi.controller';
import { CoreapiService } from './coreapi.service';

describe('CoreapiController', () => {
  let controller: CoreapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreapiController],
      providers: [CoreapiService],
    }).compile();

    controller = module.get<CoreapiController>(CoreapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
