import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Department> {
    const dept = await this.repo.findOne({ where: { id } });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  findByIds(ids: string[]): Promise<Department[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.repo.find({ where: { id: In(ids) } });
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.repo.findOne({
      where: [{ name: dto.name }, { slug: dto.slug }],
    });
    if (existing) {
      throw new ConflictException(
        existing.name === dto.name
          ? 'A department with this name already exists'
          : 'A department with this slug already exists',
      );
    }
    const dept = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
    });
    return this.repo.save(dept);
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findById(id);
    if (dto.name && dto.name !== dept.name) {
      const dup = await this.repo.findOne({ where: { name: dto.name } });
      if (dup) throw new ConflictException('A department with this name already exists');
    }
    if (dto.slug && dto.slug !== dept.slug) {
      const dup = await this.repo.findOne({ where: { slug: dto.slug } });
      if (dup) throw new ConflictException('A department with this slug already exists');
    }
    Object.assign(dept, dto);
    return this.repo.save(dept);
  }

  async delete(id: string): Promise<void> {
    const dept = await this.findById(id);
    await this.repo.remove(dept);
  }
}
