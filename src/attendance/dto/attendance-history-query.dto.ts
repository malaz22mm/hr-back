import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class AttendanceHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'ISO date start (defaults to 7 days ago)',
    example: '2025-05-01',
  })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiPropertyOptional({
    description: 'ISO date end (defaults to now)',
    example: '2025-05-17',
  })
  @IsOptional()
  @IsDateString()
  end?: string;
}
