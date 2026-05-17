import { ApiProperty } from '@nestjs/swagger';
import { EmployeeEntity } from '../entities/employee.entity';

export class PaginationMetaDto {
  @ApiProperty({ example: 120 })
  total: number;

  @ApiProperty({ example: 0 })
  skip: number;

  @ApiProperty({ example: 10 })
  take: number;

  @ApiProperty({ example: 12 })
  pages: number;
}

export class PaginatedEmployeesResponseDto {
  @ApiProperty({ type: [EmployeeEntity] })
  data: EmployeeEntity[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
