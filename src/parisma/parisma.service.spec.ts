import { Test, TestingModule } from '@nestjs/testing';
import { ParismaService } from './parisma.service';

describe('ParismaService', () => {
  let service: ParismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParismaService],
    }).compile();

    service = module.get<ParismaService>(ParismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
