import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import {
  PERMISSION_CACHE_TTL_MS,
  permissionCache,
} from './permissions.cache';

interface JwtUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string | undefined>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission required — pass through
    if (!requiredPermission) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtUser }>();
    const jwtUser = request.user;

    // SUPERADMIN bypasses all dynamic permission checks
    if (jwtUser.role === UserRole.SUPERADMIN) return true;

    const keys = await this.resolvePermissionKeys(jwtUser.id);
    return keys.has(requiredPermission);
  }

  private async resolvePermissionKeys(userId: string): Promise<Set<string>> {
    const cached = permissionCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) return cached.keys;

    const keyList = await this.usersService.getPermissionKeys(userId);
    const keys = new Set(keyList);
    permissionCache.set(userId, {
      keys,
      expiresAt: Date.now() + PERMISSION_CACHE_TTL_MS,
    });
    return keys;
  }
}
