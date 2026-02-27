import { JsonValue } from '@prisma/client/runtime/client';
import {
  DepartmentRelationType,
  ScopeType,
} from 'src/generated/prisma/enums.js';

export interface JwtPayload {
  sub: string;
  email: string;
  departmentId: string;
  roles: string[];
}

export interface PermissionEntry {
  action: string;
  resource: string;
  scope: ScopeType;
  relationType: DepartmentRelationType | null;
  constraints: JsonValue;
}

export interface RoleEntry {
  id: string;
  name: string;
  permissions: PermissionEntry[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  departmentId: string;
  managerId: string | null;
  roles: RoleEntry[];
}
