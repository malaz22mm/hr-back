import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateVacationRequestDto {
  @ApiProperty({ example: 42 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empId: number;

  @ApiProperty({ example: '2025-06-01', description: 'ISO date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-10' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Family vacation' })
  @IsString()
  @MinLength(1)
  reason: string;
}
