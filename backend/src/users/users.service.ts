import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { ListUsersDto } from './dto/list-users.dto';

type SafeUser = Omit<User, 'password' | 'refreshTokenHash' | 'invitationToken'>;

const SAFE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  status: true,
  isActive: true,
  rejectionReason: true,
  invitationTokenExpiresAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // ── Internal helpers ──────────────────────────────────────────────────────

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<SafeUser | null> {
    return this.repo.findOne({ where: { id }, select: SAFE_SELECT }) as Promise<SafeUser | null>;
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByInvitationToken(token: string): Promise<User | null> {
    return this.repo.findOne({ where: { invitationToken: token } });
  }

  async updateRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await this.repo.update(id, { refreshTokenHash: hash });
  }

  // ── Auth-driven creation ──────────────────────────────────────────────────

  async createProjectDeveloper(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = this.repo.create({
      ...data,
      role: UserRole.PROJECT_DEVELOPER,
      status: UserStatus.PENDING_APPROVAL,
      isActive: true,
    });
    return this.repo.save(user);
  }

  async activateInvitedUser(
    id: string,
    data: { password: string; firstName: string; lastName: string },
  ): Promise<void> {
    await this.repo.update(id, {
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      status: UserStatus.ACTIVE,
      invitationToken: null,
      invitationTokenExpiresAt: null,
    });
  }

  // ── SUPERADMIN user management ────────────────────────────────────────────

  async findAll(query: ListUsersDto): Promise<{
    data: SafeUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: FindOptionsWhere<User> = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;

    const [users, total] = await this.repo.findAndCount({
      where,
      select: SAFE_SELECT,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users as SafeUser[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveUser(id: string): Promise<SafeUser> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.PROJECT_DEVELOPER) {
      throw new BadRequestException('Only PROJECT_DEVELOPER accounts can be approved');
    }
    if (user.status !== UserStatus.PENDING_APPROVAL) {
      throw new BadRequestException('User is not in PENDING_APPROVAL status');
    }
    await this.repo.update(id, { status: UserStatus.ACTIVE });
    return this.findById(id) as Promise<SafeUser>;
  }

  async rejectUser(id: string, reason?: string): Promise<SafeUser> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== UserStatus.PENDING_APPROVAL) {
      throw new BadRequestException('User is not in PENDING_APPROVAL status');
    }
    await this.repo.update(id, {
      status: UserStatus.REJECTED,
      rejectionReason: reason ?? null,
    });
    return this.findById(id) as Promise<SafeUser>;
  }

  async createStaffUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole.VERIFIER | UserRole.CERTIFIER;
  }): Promise<SafeUser> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('An account with this email already exists');

    const user = this.repo.create({
      ...data,
      status: UserStatus.ACTIVE,
      isActive: true,
    });
    const saved = await this.repo.save(user);
    return this.findById(saved.id) as Promise<SafeUser>;
  }

  async inviteUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole.VERIFIER | UserRole.CERTIFIER;
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('An account with this email already exists');

    const invitationToken = randomUUID();
    const invitationTokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const user = this.repo.create({
      ...data,
      status: UserStatus.INVITED,
      isActive: true,
      invitationToken,
      invitationTokenExpiresAt,
    });
    return this.repo.save(user);
  }

  async resendInvitation(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== UserStatus.INVITED) {
      throw new BadRequestException('User is not in INVITED status');
    }

    const invitationToken = randomUUID();
    const invitationTokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await this.repo.update(id, { invitationToken, invitationTokenExpiresAt });
    return this.repo.findOne({ where: { id } }) as Promise<User>;
  }

  async toggleUserStatus(id: string, isActive: boolean, requesterId: string): Promise<SafeUser> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.SUPERADMIN) {
      throw new ForbiddenException('Cannot deactivate a SUPERADMIN account');
    }
    if (id === requesterId) {
      throw new ForbiddenException('Cannot change your own status');
    }
    await this.repo.update(id, { isActive });
    return this.findById(id) as Promise<SafeUser>;
  }

  async updateRole(
    id: string,
    role: UserRole,
    requesterId: string,
  ): Promise<SafeUser> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.SUPERADMIN || user.role === UserRole.PROJECT_DEVELOPER) {
      throw new BadRequestException(
        'Role changes are only permitted for VERIFIER and CERTIFIER accounts',
      );
    }
    if (id === requesterId) {
      throw new ForbiddenException('Cannot change your own role');
    }
    await this.repo.update(id, { role });
    return this.findById(id) as Promise<SafeUser>;
  }

  async updateMe(
    id: string,
    data: { firstName?: string; lastName?: string },
  ): Promise<SafeUser> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<SafeUser>;
  }

  // ── Seeder helper ─────────────────────────────────────────────────────────

  async upsertSuperadmin(data: {
    email: string;
    password: string;
  }): Promise<void> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      await this.repo.update(existing.id, {
        password: data.password,
        status: UserStatus.ACTIVE,
        isActive: true,
      });
      return;
    }
    const user = this.repo.create({
      email: data.email,
      password: data.password,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      isActive: true,
    });
    await this.repo.save(user);
  }
}
