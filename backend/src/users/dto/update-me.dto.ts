import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
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
