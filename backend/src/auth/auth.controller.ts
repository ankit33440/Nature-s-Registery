import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtUser } from './strategies/jwt-access.strategy';
import { JwtRefreshUser } from './strategies/jwt-refresh.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register as a Project Developer (status: PENDING_APPROVAL)' })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login — returns tokens + user profile' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; firstName: string; lastName: string; role: string };
  }> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Refresh access + refresh tokens (rotation)' })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @CurrentUser() user: JwtRefreshUser,
    @Body() _dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(user.id, user.refreshToken);
  }

  @ApiOperation({ summary: 'Accept invitation, set password, activate account' })
  @Public()
  @Post('accept-invitation')
  @HttpCode(HttpStatus.OK)
  acceptInvitation(
    @Body() dto: AcceptInvitationDto,
  ): Promise<{ message: string }> {
    return this.authService.acceptInvitation(dto);
  }

  @ApiOperation({ summary: 'Logout — invalidate refresh token' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: JwtUser): Promise<void> {
    await this.authService.logout(user.id);
  }
}
