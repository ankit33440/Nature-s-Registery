import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/entities/user.entity';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createProjectDeveloper({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
    });

    await this.emailService.sendRegistrationNotification({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    });

    return {
      message:
        'Registration successful. Your account is pending approval by the administrator.',
    };
  }

  async login(dto: LoginDto): Promise<
    TokenPair & {
      user: { id: string; email: string; firstName: string; lastName: string; role: string };
    }
  > {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    switch (user.status) {
      case UserStatus.PENDING_APPROVAL:
        throw new ForbiddenException({
          message: 'Your account is pending approval by the administrator.',
          errorCode: 'PENDING_APPROVAL',
        });
      case UserStatus.REJECTED:
        throw new ForbiddenException({
          message:
            'Your account has been rejected. Please contact the administrator.',
          errorCode: 'REJECTED',
        });
      case UserStatus.INVITED:
        throw new ForbiddenException({
          message:
            'Please complete your registration via the invitation link sent to your email.',
          errorCode: 'INVITED',
        });
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        message: 'Your account has been deactivated. Please contact the administrator.',
        errorCode: 'DEACTIVATED',
      });
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    const hash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(user.id, hash);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refresh(userId: string, rawRefreshToken: string): Promise<TokenPair> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatch = await bcrypt.compare(rawRefreshToken, user.refreshTokenHash);
    if (!tokenMatch) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    const hash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(user.id, hash);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  async acceptInvitation(dto: AcceptInvitationDto): Promise<{ message: string }> {
    const user = await this.usersService.findByInvitationToken(dto.invitationToken);

    if (!user) {
      throw new BadRequestException(
        'This invitation link is invalid. Please ask your administrator to resend the invitation.',
      );
    }

    if (!user.invitationTokenExpiresAt || user.invitationTokenExpiresAt < new Date()) {
      throw new BadRequestException(
        'This invitation link has expired. Please ask your administrator to resend the invitation.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.usersService.activateInvitedUser(user.id, {
      password: hashedPassword,
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
    });

    return { message: 'Account activated. You can now log in.' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
