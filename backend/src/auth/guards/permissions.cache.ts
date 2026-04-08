export const permissionCache = new Map<
  string,
  { keys: Set<string>; expiresAt: number }
>();

export const PERMISSION_CACHE_TTL_MS = 60_000;

export function clearAllPermissionCache(): void {
  permissionCache.clear();
}
