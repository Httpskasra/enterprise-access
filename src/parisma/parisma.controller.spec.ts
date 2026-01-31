import { Test, TestingModule } from '@nestjs/testing';
import { ParismaController } from './parisma.controller';
import { ParismaService } from './parisma.service';

describe('ParismaController', () => {
  let controller: ParismaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParismaController],
      providers: [ParismaService],
    }).compile();

    controller = module.get<ParismaController>(ParismaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
