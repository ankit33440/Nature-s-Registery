import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'Create Projects' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'projects:create', description: 'Format: resource:action' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+:[a-z]+$/, {
    message: 'key must be in format resource:action (lowercase letters only)',
  })
  key!: string;

  @ApiProperty({ example: 'projects' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  resource!: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  action!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
