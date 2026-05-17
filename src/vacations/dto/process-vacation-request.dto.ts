import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsString, IsUUID } from 'class-validator';

export class ProcessVacationRequestDto {
  @ApiProperty({
    description: 'Admin user UUID (prefer JWT sub in future)',
    example: '24b5d2c3-3da5-4d6e-9a4e-f088c75433f2',
  })
  @IsString()
  @IsUUID()
  adminId: string;

  @ApiProperty({
    description: '1 = Approved, 2 = Rejected',
    example: 1,
    enum: [1, 2],
  })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  statusId: number;
}
