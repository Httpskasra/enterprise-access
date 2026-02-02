import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/radis.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [AppController],
  providers: [RedisService, AppService],
})
export class AppModule {}
