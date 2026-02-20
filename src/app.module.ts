import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/radis.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [RedisService, AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SetPostgresSessionMiddleware).forRoutes('*');
//   }
// }
