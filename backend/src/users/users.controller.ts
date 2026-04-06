import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtUser } from '../auth/strategies/jwt-access.strategy';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User, UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @Get('me')
  async getMe(@CurrentUser() jwtUser: JwtUser): Promise<User | null> {
    return this.usersService.findById(jwtUser.id);
  }

  @ApiOperation({ summary: 'List all users with pagination (SUPERADMIN only)' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{
    data: Omit<User, 'password' | 'refreshTokenHash'>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const { users, total } = await this.usersService.findAll(page, limit);
    return { data: users, total, page, limit };
  }

  @ApiOperation({ summary: "Update a user's role (SUPERADMIN only)" })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() jwtUser: JwtUser,
  ): Promise<User> {
    if (jwtUser.id === id) {
      throw new ForbiddenException('You cannot change your own role');
    }
    return this.usersService.updateRole(id, dto.role);
  }

  @ApiOperation({ summary: 'Activate or deactivate a user (SUPERADMIN only)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() jwtUser: JwtUser,
  ): Promise<User> {
    if (jwtUser.id === id) {
      throw new ForbiddenException('You cannot change your own status');
    }
    return this.usersService.updateStatus(id, dto.isActive);
  }
}
