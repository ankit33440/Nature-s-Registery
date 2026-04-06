import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ description: 'Invitation token from the email link' })
  @IsUUID()
  invitationToken!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;
}
