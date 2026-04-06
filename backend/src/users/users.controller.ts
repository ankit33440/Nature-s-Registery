import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtUser } from '../auth/strategies/jwt-access.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { RejectUserDto } from './dto/reject-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  // ── Any authenticated user ────────────────────────────────────────────────

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Update own name' })
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  updateMe(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateMeDto,
  ) {
    return this.usersService.updateMe(user.id, dto);
  }

  // ── SUPERADMIN only ───────────────────────────────────────────────────────

  @ApiOperation({ summary: 'List all users with filters + pagination (SUPERADMIN)' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  findAll(@Query() query: ListUsersDto) {
    return this.usersService.findAll(query);
  }

  @ApiOperation({ summary: 'Approve a pending PROJECT_DEVELOPER (SUPERADMIN)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.approveUser(id);
  }

  @ApiOperation({ summary: 'Reject a pending PROJECT_DEVELOPER (SUPERADMIN)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectUserDto,
  ) {
    return this.usersService.rejectUser(id, dto.reason);
  }

  @ApiOperation({ summary: 'Direct-create a VERIFIER or CERTIFIER user (SUPERADMIN)' })
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createStaff(@Body() dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.createStaffUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role: dto.role as UserRole.VERIFIER | UserRole.CERTIFIER,
    });
  }

  @ApiOperation({ summary: 'Invite a VERIFIER or CERTIFIER via email (SUPERADMIN)' })
  @Post('invite')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(@Body() dto: InviteUserDto) {
    const user = await this.usersService.inviteUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      role: dto.role as UserRole.VERIFIER | UserRole.CERTIFIER,
    });

    await this.emailService.sendInvitation({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      invitationToken: user.invitationToken!,
    });

    return { message: `Invitation sent to ${user.email}` };
  }

  @ApiOperation({ summary: 'Resend invitation email (SUPERADMIN)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Post('invite/:id/resend')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  async resendInvitation(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.resendInvitation(id);

    await this.emailService.sendInvitation({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      invitationToken: user.invitationToken!,
    });

    return { message: `Invitation resent to ${user.email}` };
  }

  @ApiOperation({ summary: "Toggle a user's active status (SUPERADMIN)" })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() requester: JwtUser,
  ) {
    return this.usersService.toggleUserStatus(id, dto.isActive, requester.id);
  }

  @ApiOperation({ summary: "Update a VERIFIER or CERTIFIER's role (SUPERADMIN)" })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() requester: JwtUser,
  ) {
    return this.usersService.updateRole(id, dto.role, requester.id);
  }
}
