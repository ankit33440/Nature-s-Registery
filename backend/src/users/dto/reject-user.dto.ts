import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectUserDto {
  @ApiPropertyOptional({ example: 'Insufficient project documentation provided.' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  reason?: string;
}
