import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'requiredPermission';

/**
 * Decorate a route handler with a required dynamic permission key.
 * Format: "resource:action" e.g. @RequirePermission('projects:create')
 * Use together with @UseGuards(PermissionsGuard).
 * SUPERADMIN always bypasses this check.
 */
export const RequirePermission = (
  permission: string,
): ReturnType<typeof SetMetadata> => SetMetadata(PERMISSION_KEY, permission);
