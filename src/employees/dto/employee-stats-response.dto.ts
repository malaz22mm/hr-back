import { ApiProperty } from '@nestjs/swagger';

export class EmployeeStatsGroupDto {
  @ApiProperty({
    description: 'Grouped lookup ID (e.g. department_id value)',
    example: 2,
  })
  group: number;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 6500 })
  averageSalary: number;

  @ApiProperty({ example: 34 })
  averageAge: number;

  @ApiProperty({ example: 5.2 })
  averageTenure: number;

  @ApiProperty({ example: 3.5 })
  avgEngagement: number;

  @ApiProperty({ example: 2.8 })
  avgWorkload: number;
}
