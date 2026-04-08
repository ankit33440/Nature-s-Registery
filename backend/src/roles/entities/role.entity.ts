import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true, default: null })
  description!: string | null;

  /** System roles cannot be deleted */
  @Column({ default: false })
  isSystem!: boolean;

  @ManyToMany(() => Permission, { eager: false })
  @JoinTable({ name: 'role_permissions' })
  permissions!: Permission[];

  @ManyToMany(() => Department, { eager: false })
  @JoinTable({ name: 'role_departments' })
  departments!: Department[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
