import { Module } from '@nestjs/common';
import { ParismaService } from './parisma.service';
import { ParismaController } from './parisma.controller';

@Module({
  controllers: [ParismaController],
  providers: [ParismaService],
})
export class ParismaModule {}
