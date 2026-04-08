/**
 * RBAC seed script — run with: npm run seed:rbac
 * Idempotent: safe to re-run.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';

interface PermissionDef {
  name: string;
  key: string;
  resource: string;
  action: string;
  description?: string;
}

const SYSTEM_PERMISSIONS: PermissionDef[] = [
  // users
  { name: 'Read Users', key: 'users:read', resource: 'users', action: 'read' },
  { name: 'Create Users', key: 'users:create', resource: 'users', action: 'create' },
  { name: 'Update Users', key: 'users:update', resource: 'users', action: 'update' },
  { name: 'Delete Users', key: 'users:delete', resource: 'users', action: 'delete' },
  { name: 'Manage Users', key: 'users:manage', resource: 'users', action: 'manage' },
  // projects
  { name: 'Read Projects', key: 'projects:read', resource: 'projects', action: 'read' },
  { name: 'Create Projects', key: 'projects:create', resource: 'projects', action: 'create' },
  { name: 'Update Projects', key: 'projects:update', resource: 'projects', action: 'update' },
  { name: 'Delete Projects', key: 'projects:delete', resource: 'projects', action: 'delete' },
  { name: 'Manage Projects', key: 'projects:manage', resource: 'projects', action: 'manage' },
  // verification
  { name: 'Read Verifications', key: 'verification:read', resource: 'verification', action: 'read' },
  { name: 'Create Verifications', key: 'verification:create', resource: 'verification', action: 'create' },
  { name: 'Update Verifications', key: 'verification:update', resource: 'verification', action: 'update' },
  { name: 'Manage Verifications', key: 'verification:manage', resource: 'verification', action: 'manage' },
  // certification
  { name: 'Read Certifications', key: 'certification:read', resource: 'certification', action: 'read' },
  { name: 'Create Certifications', key: 'certification:create', resource: 'certification', action: 'create' },
  { name: 'Update Certifications', key: 'certification:update', resource: 'certification', action: 'update' },
  { name: 'Manage Certifications', key: 'certification:manage', resource: 'certification', action: 'manage' },
  // credits
  { name: 'Read Credits', key: 'credits:read', resource: 'credits', action: 'read' },
  { name: 'Create Credits', key: 'credits:create', resource: 'credits', action: 'create' },
  { name: 'Issue Credits', key: 'credits:issue', resource: 'credits', action: 'issue' },
  { name: 'Manage Credits', key: 'credits:manage', resource: 'credits', action: 'manage' },
  // reports
  { name: 'Read Reports', key: 'reports:read', resource: 'reports', action: 'read' },
  { name: 'Create Reports', key: 'reports:create', resource: 'reports', action: 'create' },
  { name: 'Export Reports', key: 'reports:export', resource: 'reports', action: 'export' },
  // transactions
  { name: 'Read Transactions', key: 'transactions:read', resource: 'transactions', action: 'read' },
  { name: 'Create Transactions', key: 'transactions:create', resource: 'transactions', action: 'create' },
  { name: 'Manage Transactions', key: 'transactions:manage', resource: 'transactions', action: 'manage' },
  // departments
  { name: 'Read Departments', key: 'departments:read', resource: 'departments', action: 'read' },
  { name: 'Manage Departments', key: 'departments:manage', resource: 'departments', action: 'manage' },
];

interface RoleDef {
  name: string;
  slug: string;
  description: string;
  permissionKeys: string[];
}

const SYSTEM_ROLES: RoleDef[] = [
  {
    name: 'Verifier',
    slug: 'verifier',
    description: 'Can review and verify carbon credit projects',
    permissionKeys: [
      'verification:read',
      'verification:create',
      'verification:update',
      'verification:manage',
      'projects:read',
      'reports:read',
    ],
  },
  {
    name: 'Certifier',
    slug: 'certifier',
    description: 'Can certify and recertify carbon credit projects',
    permissionKeys: [
      'certification:read',
      'certification:create',
      'certification:update',
      'certification:manage',
      'projects:read',
      'reports:read',
    ],
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const permissionsService = app.get(PermissionsService);
  const rolesService = app.get(RolesService);

  console.log('⏳  Seeding system permissions...');
  for (const def of SYSTEM_PERMISSIONS) {
    await permissionsService.upsertSystemPermission(def);
    process.stdout.write('.');
  }
  console.log(`\n✅  ${SYSTEM_PERMISSIONS.length} permissions seeded.`);

  console.log('⏳  Seeding system roles...');
  for (const def of SYSTEM_ROLES) {
    await rolesService.upsertSystemRole(def);
    process.stdout.write('.');
  }
  console.log(`\n✅  ${SYSTEM_ROLES.length} roles seeded.`);

  await app.close();
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
