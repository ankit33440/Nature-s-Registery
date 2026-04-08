import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.repo.find({ order: { resource: 'ASC', action: 'ASC' } });
  }

  async findById(id: string): Promise<Permission> {
    const perm = await this.repo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    return perm;
  }

  findByIds(ids: string[]): Promise<Permission[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.repo.find({ where: { id: In(ids) } });
  }

  findByKeys(keys: string[]): Promise<Permission[]> {
    if (!keys.length) return Promise.resolve([]);
    return this.repo.find({ where: { key: In(keys) } });
  }

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.repo.findOne({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException(`Permission with key "${dto.key}" already exists`);
    }
    const perm = this.repo.create({
      name: dto.name,
      key: dto.key,
      resource: dto.resource,
      action: dto.action,
      description: dto.description ?? null,
      isSystem: false,
    });
    return this.repo.save(perm);
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    const perm = await this.findById(id);
    if (dto.key && dto.key !== perm.key) {
      const dup = await this.repo.findOne({ where: { key: dto.key } });
      if (dup) throw new ConflictException(`Permission with key "${dto.key}" already exists`);
    }
    Object.assign(perm, dto);
    return this.repo.save(perm);
  }

  async delete(id: string): Promise<void> {
    const perm = await this.findById(id);
    if (perm.isSystem) {
      throw new ForbiddenException('System permissions cannot be deleted');
    }
    await this.repo.remove(perm);
  }

  /** Idempotent upsert used by the seed script */
  async upsertSystemPermission(def: {
    name: string;
    key: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<Permission> {
    const existing = await this.repo.findOne({ where: { key: def.key } });
    if (existing) return existing;
    return this.repo.save(
      this.repo.create({ ...def, description: def.description ?? null, isSystem: true }),
    );
  }
}
