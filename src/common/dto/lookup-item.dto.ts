import { ApiProperty } from '@nestjs/swagger';

export class LookupItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sales' })
  name: string;

  @ApiProperty({ example: 'sales' })
  name_code: string;
}

export class WorkShiftDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Morning Shift' })
  shift_name: string;

  @ApiProperty({ example: '2024-01-01T08:00:00.000Z' })
  start_time: string;

  @ApiProperty({ example: '2024-01-01T17:00:00.000Z' })
  end_time: string;

  @ApiProperty({ example: 15 })
  grace_period_minutes: number;
}
