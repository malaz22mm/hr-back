import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Fields we allow grouping by for HR analytics.
 * VALUES must match the exact column names in the Employees Prisma model.
 */
export enum GroupByField {
  DEPARTMENT = 'department_id',
  JOB_ROLE = 'job_role_id',
  EDUCATION = 'education_id',
  HEALTH_STATE = 'health_state_id',
  MARITAL_STATUS = 'marital_status_id',
  BUSINESS_TRAVEL = 'business_travel_id',
  WORK_SHIFT = 'work_shift_id',
  ATTRITION_RISK = 'attrition_risk_class_id',
  PERFORMANCE = 'performance_rating_id',
}

export class EmployeeStatsDto {
  @ApiProperty({
    enum: GroupByField,
    description: 'The relational field to group data by for analytics (e.g. department_id)',
    example: GroupByField.DEPARTMENT,
  })
  @IsEnum(GroupByField)
  @IsNotEmpty()
  groupBy: GroupByField;
}