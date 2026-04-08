import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true, default: null })
  password!: string | null;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PROJECT_DEVELOPER })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_APPROVAL })
  status!: UserStatus;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true, default: null })
  refreshTokenHash!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  invitationToken!: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  invitationTokenExpiresAt!: Date | null;

  @Column({ type: 'text', nullable: true, default: null })
  rejectionReason!: string | null;

  /** Dynamic roles assigned via RBAC management UI */
  @ManyToMany(() => Role, { eager: false })
  @JoinTable({ name: 'user_dynamic_roles' })
  dynamicRoles!: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
