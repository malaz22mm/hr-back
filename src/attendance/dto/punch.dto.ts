import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PunchDto {
  @ApiProperty({
    description: 'Employee integer ID (hardware badge / blip)',
    example: 42,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  empId: number;
}
