import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class BaseEmployeeDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  name_code: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  attrition: boolean;

  @ApiProperty({ example: 35 })
  @IsInt()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: true, description: 'true for men' })
  @IsBoolean()
  @IsNotEmpty()
  gender: boolean;

  @ApiProperty({ example: 12 })
  @IsInt()
  @IsNotEmpty()
  distance_from_home: number;

  @ApiProperty({ example: 60 })
  @IsInt()
  @IsNotEmpty()
  hourly_rate: number;

  @ApiProperty({ example: 480 })
  @IsInt()
  @IsNotEmpty()
  daily_rate: number;

  @ApiProperty({ example: 12000 })
  @IsInt()
  @IsNotEmpty()
  monthly_rate: number;

  @ApiProperty({ example: 4500 })
  @IsInt()
  @IsNotEmpty()
  monthly_income: number;

  @ApiProperty({ example: 15 })
  @IsInt()
  @IsNotEmpty()
  percent_salary_hike: number;

  @ApiProperty({ example: 3, description: 'Job level from 1 to 5' })
  @IsInt()
  @IsNotEmpty()
  job_level: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  num_of_companies_worked: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsNotEmpty()
  total_working_years: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  training_times_last_year: number;

  @ApiProperty({ example: 40 })
  @IsInt()
  @IsNotEmpty()
  training_hours_last_year: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @IsNotEmpty()
  training_hours_last_6_months: number;

  @ApiProperty({ example: 75 })
  @IsInt()
  @IsNotEmpty()
  training_gap_score: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  years_at_company: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  years_in_current_role: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  years_since_last_promotion: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsNotEmpty()
  years_with_curr_manager: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  stock_option_level: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  over_time: boolean;

  @ApiProperty({ example: 70 })
  @IsInt()
  @IsNotEmpty()
  workload_pressure_index: number;

  @ApiProperty({ example: 82 })
  @IsInt()
  @IsNotEmpty()
  engagement_score: number;

  @ApiProperty({ example: 88 })
  @IsInt()
  @IsNotEmpty()
  engagement_feedback_score: number;

  @ApiProperty({ example: 0.15 })
  @IsNumber()
  @IsNotEmpty()
  promotion_stagnation_ratio: number;

  @ApiProperty({ example: 0.85 })
  @IsNumber()
  @IsNotEmpty()
  role_stability_ratio: number;

  // Foreign Key IDs (Lookup Table references)
  @ApiProperty({ example: 1, description: 'ID from MaritalStatus table' })
  @IsInt()
  @IsNotEmpty()
  marital_status_id: number;

  @ApiProperty({ example: 1, description: 'ID from JobRoleType table' })
  @IsInt()
  @IsNotEmpty()
  job_role_id: number;

  @ApiProperty({ example: 1, description: 'ID from BusinessTravel table' })
  @IsInt()
  @IsNotEmpty()
  business_travel_id: number;

  @ApiProperty({ example: 1, description: 'ID from DepartmentType table' })
  @IsInt()
  @IsNotEmpty()
  department_id: number;

  @ApiProperty({ example: 1, description: 'ID from Education table' })
  @IsInt()
  @IsNotEmpty()
  education_id: number;

  @ApiProperty({ example: 1, description: 'ID from PerformanceRating table' })
  @IsInt()
  @IsNotEmpty()
  performance_rating_id: number;

  @ApiProperty({ example: 1, description: 'ID from AttritionRiskClass table' })
  @IsInt()
  @IsNotEmpty()
  attrition_risk_class_id: number;

  @ApiProperty({ example: 1, description: 'ID from WorkShift table' })
  @IsInt()
  @IsNotEmpty()
  work_shift_id: number;

  // Satisfaction IDs (All point to Satisfaction table)
  @ApiProperty({ example: 3, description: 'Environment Satisfaction ID' })
  @IsInt()
  @IsNotEmpty()
  environment_satisfaction_id: number;

  @ApiProperty({ example: 3, description: 'Job Involvement ID' })
  @IsInt()
  @IsNotEmpty()
  job_involvement_id: number;

  @ApiProperty({ example: 3, description: 'Job Satisfaction ID' })
  @IsInt()
  @IsNotEmpty()
  job_satisfaction_id: number;

  @ApiProperty({ example: 3, description: 'Relationship Satisfaction ID' })
  @IsInt()
  @IsNotEmpty()
  relationship_satisfaction_id: number;

  @ApiProperty({ example: 3, description: 'Work Life Balance ID' })
  @IsInt()
  @IsNotEmpty()
  work_life_balance_id: number;
}