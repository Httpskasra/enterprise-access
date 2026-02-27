/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Controller, Post, HttpCode, Body, HttpStatus } from '@nestjs/common';

import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import type { AuthenticatedUser } from 'src/common/interfaces/auth.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
/**
 * AuthController
 *
 * All routes here that need NO auth are marked with @Public().
 * The JwtAuthGuard is applied globally in AppModule, so without @Public(),
 * every route requires a valid JWT.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Public - no token needed
   */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Public - returns accessToken + refreshToken
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/refresh
   * Public - uses refresh token to get new access token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    // In a real app, decode the refresh token to get userId
    // Here we expect userId to be sent alongside or decoded from the token
    // For simplicity, we decode manually
    return this.authService.refreshTokens('', dto.refreshToken);
  }

  /**
   * POST /auth/logout
   * Protected - requires valid JWT
   * Uses @CurrentUser() to get the authenticated user
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id);
  }

  /**
   * GET /auth/me
   * Protected - returns the current authenticated user
   */
  @Post('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
