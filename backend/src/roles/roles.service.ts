import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { clearAllPermissionCache } from '../auth/guards/permissions.cache';
import { DepartmentsService } from '../departments/departments.service';
import { PermissionsService } from '../permissions/permissions.service';
import { User } from '../users/entities/user.entity';
import { AssignDepartmentsDto } from './dto/assign-departments.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly permissionsService: PermissionsService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  findAll(): Promise<Role[]> {
    return this.repo.find({
      relations: ['permissions', 'departments'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Role> {
    const role = await this.repo.findOne({
      where: { id },
      relations: ['permissions', 'departments'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  getRolesByIds(ids: string[]): Promise<Role[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.repo.find({ where: { id: In(ids) } });
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionsService.findByIds(dto.permissionIds ?? []);
    const departments = await this.departmentsService.findByIds(dto.departmentIds ?? []);

    const role = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      isSystem: false,
      permissions,
      departments,
    });
    return this.repo.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    if (dto.name !== undefined) role.name = dto.name;
    if (dto.slug !== undefined) role.slug = dto.slug;
    if (dto.description !== undefined) role.description = dto.description ?? null;

    if (dto.permissionIds !== undefined) {
      role.permissions = await this.permissionsService.findByIds(dto.permissionIds);
      clearAllPermissionCache();
    }
    if (dto.departmentIds !== undefined) {
      role.departments = await this.departmentsService.findByIds(dto.departmentIds);
    }

    return this.repo.save(role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.findById(id);
    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted');
    }

    const assignedUserCount = await this.usersRepo
      .createQueryBuilder('user')
      .innerJoin('user.dynamicRoles', 'role')
      .where('role.id = :id', { id })
      .getCount();

    if (assignedUserCount > 0) {
      throw new BadRequestException(
        'Cannot delete a role that is currently assigned to users',
      );
    }

    clearAllPermissionCache();
    await this.repo.remove(role);
    return;

    // Check no users have this role assigned
    const count = await this.repo
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .where('role.id = :id', { id })
      .getCount()
      .catch(() => 0); // user relation doesn't exist on Role — skip check
    if (count > 0) {
      throw new BadRequestException(
        'Cannot delete a role that is currently assigned to users',
      );
    }
    clearAllPermissionCache();
    await this.repo.remove(role);
  }

  async setPermissions(id: string, dto: AssignPermissionsDto): Promise<Role> {
    const role = await this.findById(id);
    role.permissions = await this.permissionsService.findByIds(dto.permissionIds);
    clearAllPermissionCache();
    return this.repo.save(role);
  }

  async setDepartments(id: string, dto: AssignDepartmentsDto): Promise<Role> {
    const role = await this.findById(id);
    role.departments = await this.departmentsService.findByIds(dto.departmentIds);
    return this.repo.save(role);
  }

  /** Idempotent upsert used by the seed script */
  async upsertSystemRole(def: {
    name: string;
    slug: string;
    permissionKeys: string[];
    description?: string;
  }): Promise<Role> {
    const permissions = await this.permissionsService.findByKeys(def.permissionKeys);
    let role = await this.repo.findOne({
      where: { slug: def.slug },
      relations: ['permissions'],
    });
    if (role) {
      role.permissions = permissions;
      role.isSystem = true;
      return this.repo.save(role);
    }
    return this.repo.save(
      this.repo.create({
        name: def.name,
        slug: def.slug,
        description: def.description ?? null,
        isSystem: true,
        permissions,
        departments: [],
      }),
    );
  }
}
