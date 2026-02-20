// src/auth/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ScopeType } from '../../generated/prisma/client.js';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionMetadata {
  action: string;
  resource: string;
  scope?: ScopeType; // اختیاری، اگر نیاز به محدودیت سطح ردیف باشد
}

export const Permissions = (metadata: PermissionMetadata) =>
  SetMetadata(PERMISSIONS_KEY, metadata);
