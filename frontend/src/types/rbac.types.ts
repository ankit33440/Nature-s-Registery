export interface Permission {
  id: string;
  name: string;
  key: string;
  resource: string;
  action: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

/** Permissions grouped by resource key */
export type PermissionsGrouped = Record<string, Permission[]>;
