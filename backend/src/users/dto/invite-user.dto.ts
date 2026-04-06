import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

const ALLOWED_ROLES = [UserRole.VERIFIER, UserRole.CERTIFIER] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export class InviteUserDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: [UserRole.VERIFIER, UserRole.CERTIFIER] })
  @IsEnum(ALLOWED_ROLES, { message: 'role must be VERIFIER or CERTIFIER' })
  role!: AllowedRole;
}
