/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionGuard } from './common/guards/permission.guard';
import { UsersController } from './users/users.controller';

/**
 * AppModule
 *
 * Key decisions:
 *
 * 1. JwtAuthGuard is registered as APP_GUARD → applies to ALL routes globally.
 *    Routes that should be public must use @Public() decorator.
 *
 * 2. PermissionGuard is also registered globally → it runs on all routes,
 *    but only does work when @RequirePermission() is present.
 *
 * 3. PrismaModule is @Global() → available everywhere without re-importing.
 *
 * 4. ConfigModule.forRoot() loads .env file into ConfigService.
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [
    // ① Every route requires JWT by default
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // ② Every route with @RequirePermission() will check scope
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
