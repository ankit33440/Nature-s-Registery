export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  PROJECT_DEVELOPER = 'PROJECT_DEVELOPER',
  VERIFIER = 'VERIFIER',
  CERTIFIER = 'CERTIFIER',
  BUYER = 'BUYER',
}

export enum UserStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  INVITED = 'INVITED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}
