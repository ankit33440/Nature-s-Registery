import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

const ALLOWED_ROLES = [UserRole.VERIFIER, UserRole.CERTIFIER] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export class CreateUserDto {
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

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: [UserRole.VERIFIER, UserRole.CERTIFIER] })
  @IsEnum(ALLOWED_ROLES, { message: 'role must be VERIFIER or CERTIFIER' })
  role!: AllowedRole;
}
