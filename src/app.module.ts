import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParismaModule } from './parisma/parisma.module';

@Module({
  imports: [ParismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
