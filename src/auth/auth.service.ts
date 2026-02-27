/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtPayload } from '../common/interfaces/auth.interface';

/**
 * NOTE: The schema doesn't have a password field on User.
 * In a real project you'd add:
 *   password  String
 *   refreshToken String?
 * to the User model. This service assumes those fields exist.
 *
 * The schema focuses on RBAC structure, so we handle auth logic here.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // 1. Check if email is already taken
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    // 2. Verify the department exists
    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId },
    });
    if (!department) throw new NotFoundException('Department not found');

    // 3. Hash password (12 salt rounds is production-safe)
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // 4. Create the user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword, // requires password field in schema
        departmentId: dto.departmentId,
        managerId: dto.managerId ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        departmentId: true,
      },
    });

    return { message: 'User registered successfully', user };
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async login(dto: LoginDto) {
    // 1. Find user with roles (needed for JWT payload)
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // requires password field in schema
        departmentId: true,
        roles: {
          select: {
            role: { select: { name: true } },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    // 3. Build JWT payload
    // We store minimal info in the token; full user is loaded in JwtStrategy.validate()
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      departmentId: user.departmentId,
      roles: user.roles.map((ur) => ur.role.name),
    };

    // 4. Generate tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload.sub),
    ]);

    // 5. Store hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }, // requires refreshToken field in schema
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // ─────────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        departmentId: true,
        refreshToken: true, // requires refreshToken field in schema
        roles: {
          select: { role: { select: { name: true } } },
        },
      },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Compare provided token with stored hash
    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new UnauthorizedException('Invalid refresh token');

    // Issue new token pair (rotation)
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      departmentId: user.departmentId,
      roles: user.roles.map((ur) => ur.role.name),
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(user.id),
    ]);

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefreshToken },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  async logout(userId: string) {
    // Remove stored refresh token so it can't be reused
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────
  private signAccessToken(payload: JwtPayload): Promise<string> {
    const expiresIn = (this.config.get<string>('JWT_EXPIRES_IN') ||
      '15m') as any;
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }

  private signRefreshToken(userId: string): Promise<string> {
    const expiresIn = (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ||
      '7d') as any;
    return this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn,
      },
    );
  }
}
