import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  PROJECT_DEVELOPER = 'PROJECT_DEVELOPER',
  VERIFIER = 'VERIFIER',
  CERTIFIER = 'CERTIFIER',
  BUYER = 'BUYER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true, default: null })
  refreshTokenHash!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
