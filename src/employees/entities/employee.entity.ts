import { ApiProperty } from '@nestjs/swagger';

export class EmployeeEntity {
  @ApiProperty({
    description: 'Unique identifier (Autoincrement)',
    example: 1,
  })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john_doe' })
  name_code: string;

  @ApiProperty({ example: false })
  attrition: boolean;

  @ApiProperty({ example: 34, description: 'Age of the employee' })
  age: number;

  @ApiProperty({ example: true, description: 'true for men' })
  gender: boolean;

  @ApiProperty({
    example: 'Healthy',
    description: 'Optional employee health status',
    nullable: true,
  })
  health_status: string | null;

  @ApiProperty({ example: 5, description: 'Distance from home in km' })
  distance_from_home: number;

  @ApiProperty({ example: 60 })
  hourly_rate: number;

  @ApiProperty({ example: 480 })
  daily_rate: number;

  @ApiProperty({ example: 12000 })
  monthly_rate: number;

  @ApiProperty({ example: 5000, description: 'Monthly income' })
  monthly_income: number;

  @ApiProperty({ example: 12, description: 'Percent salary hike' })
  percent_salary_hike: number;

  @ApiProperty({ example: 2, description: 'Job level (1-5)' })
  job_level: number;

  @ApiProperty({
    example: 3,
    description: 'Number of companies worked at previously',
  })
  num_of_companies_worked: number;

  @ApiProperty({ example: 10, description: 'Total working years' })
  total_working_years: number;

  @ApiProperty({ example: 2, description: 'Training times last year' })
  training_times_last_year: number;

  @ApiProperty({ example: 40, description: 'Training hours last year' })
  training_hours_last_year: number;

  @ApiProperty({ example: 20, description: 'Training hours last 6 months' })
  training_hours_last_6_months: number;

  @ApiProperty({ example: 0, description: 'Training gap score' })
  training_gap_score: number;

  @ApiProperty({ example: 5, description: 'Years at current company' })
  years_at_company: number;

  @ApiProperty({ example: 2, description: 'Years in current role' })
  years_in_current_role: number;

  @ApiProperty({ example: 1, description: 'Years since last promotion' })
  years_since_last_promotion: number;

  @ApiProperty({ example: 2, description: 'Years with current manager' })
  years_with_curr_manager: number;

  @ApiProperty({ example: 1 })
  stock_option_level: number;

  @ApiProperty({ example: false })
  over_time: boolean;

  @ApiProperty({ example: 65, description: 'Workload pressure index' })
  workload_pressure_index: number;

  @ApiProperty({ example: 88, description: 'Engagement score' })
  engagement_score: number;

  @ApiProperty({ example: 90, description: 'Engagement feedback score' })
  engagement_feedback_score: number;

  @ApiProperty({ example: 0.15 })
  promotion_stagnation_ratio: number;

  @ApiProperty({ example: 0.95 })
  role_stability_ratio: number;

  // --- Foreign Key IDs ---

  @ApiProperty({ example: 1 })
  marital_status_id: number;

  @ApiProperty({ example: 1 })
  job_role_id: number;

  @ApiProperty({ example: 1 })
  business_travel_id: number;

  @ApiProperty({ example: 1 })
  department_id: number;

  @ApiProperty({ example: 1 })
  education_id: number;

  @ApiProperty({ example: 1 })
  performance_rating_id: number;

  @ApiProperty({ example: 1 })
  attrition_risk_class_id: number;

  @ApiProperty({ example: 1 })
  work_shift_id: number;

  // --- Satisfaction IDs ---

  @ApiProperty({ example: 3 })
  environment_satisfaction_id: number;

  @ApiProperty({ example: 3 })
  job_involvement_id: number;

  @ApiProperty({ example: 3 })
  job_satisfaction_id: number;

  @ApiProperty({ example: 3 })
  relationship_satisfaction_id: number;

  @ApiProperty({ example: 3 })
  work_life_balance_id: number;
}
