export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  PROJECT_DEVELOPER = 'PROJECT_DEVELOPER',
  VERIFIER = 'VERIFIER',
  CERTIFIER = 'CERTIFIER',
  BUYER = 'BUYER',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
