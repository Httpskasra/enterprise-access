/* eslint-disable @typescript-eslint/no-floating-promises */

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '../../prisma/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(); // یا super({ log: ['query', 'error'] }) اگر خواستی لاگ بگیری
  }
  async onModuleInit() {
    await this.$connect();
  }

  ableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close();
    });
  }
}
