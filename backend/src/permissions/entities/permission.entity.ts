import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  /** Format: "resource:action" e.g. "projects:create" */
  @Column({ unique: true })
  key!: string;

  @Column()
  resource!: string;

  @Column()
  action!: string;

  @Column({ type: 'text', nullable: true, default: null })
  description!: string | null;

  /** System permissions cannot be deleted */
  @Column({ default: false })
  isSystem!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
