import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class EmployeeQueryDto {
  // ===========================================================================
  // Pagination & Sorting
  // ===========================================================================
  @ApiPropertyOptional({ description: 'Number of records to skip', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of records to take',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'monthly_income',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;

  // ===========================================================================
  // Categorical Filters (IDs to Lookup Tables)
  // ===========================================================================

  @ApiPropertyOptional({ description: 'Attrition status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  attrition?: boolean;

  @ApiPropertyOptional({ description: 'Business Travel Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  businessTravelId?: number;

  @ApiPropertyOptional({ description: 'Department Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'Education Level Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  educationId?: number;

  @ApiPropertyOptional({ description: 'Job Role Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  jobRoleId?: number;

  @ApiPropertyOptional({ description: 'Marital Status Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maritalStatusId?: number;

  @ApiPropertyOptional({ description: 'Attrition Risk Class Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  attritionRiskClassId?: number;

  @ApiPropertyOptional({ description: 'Work Shift Lookup ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  workShiftId?: number;

  @ApiPropertyOptional({ description: 'Overtime status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  overTime?: boolean;

  @ApiPropertyOptional({ description: 'Gender (true for men)' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional({ description: 'Health status exact match' })
  @IsOptional()
  @IsString()
  healthStatus?: string;

  // ===========================================================================
  // Rating Filters (All point to Satisfaction Lookup Table)
  // ===========================================================================

  @ApiPropertyOptional({ description: 'Environment Satisfaction ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  environmentSatisfactionId?: number;

  @ApiPropertyOptional({ description: 'Job Involvement ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  jobInvolvementId?: number;

  @ApiPropertyOptional({ description: 'Job Satisfaction ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  jobSatisfactionId?: number;

  @ApiPropertyOptional({ description: 'Performance Rating ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  performanceRatingId?: number;

  @ApiPropertyOptional({ description: 'Relationship Satisfaction ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  relationshipSatisfactionId?: number;

  @ApiPropertyOptional({ description: 'Work Life Balance ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  workLifeBalanceId?: number;

  // ===========================================================================
  // Numeric Ranges (Min / Max)
  // ===========================================================================

  // Age
  @ApiPropertyOptional({ description: 'Minimum Age' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAge?: number;

  @ApiPropertyOptional({ description: 'Maximum Age' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAge?: number;

  // Job Level
  @ApiPropertyOptional({ description: 'Minimum Job Level (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minJobLevel?: number;

  @ApiPropertyOptional({ description: 'Maximum Job Level (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxJobLevel?: number;

  // Monthly Income
  @ApiPropertyOptional({ description: 'Minimum Monthly Income' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minMonthlyIncome?: number;

  @ApiPropertyOptional({ description: 'Maximum Monthly Income' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxMonthlyIncome?: number;

  // Percent Salary Hike
  @ApiPropertyOptional({ description: 'Minimum Percent Salary Hike' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPercentSalaryHike?: number;

  @ApiPropertyOptional({ description: 'Maximum Percent Salary Hike' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPercentSalaryHike?: number;

  // Total Working Years
  @ApiPropertyOptional({ description: 'Minimum Total Working Years' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minTotalWorkingYears?: number;

  @ApiPropertyOptional({ description: 'Maximum Total Working Years' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTotalWorkingYears?: number;

  // Companies Worked
  @ApiPropertyOptional({ description: 'Minimum Number of Companies Worked' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minNumCompaniesWorked?: number;

  @ApiPropertyOptional({ description: 'Maximum Number of Companies Worked' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxNumCompaniesWorked?: number;

  // Years At Company
  @ApiPropertyOptional({ description: 'Minimum Years at Company' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minYearsAtCompany?: number;

  @ApiPropertyOptional({ description: 'Maximum Years at Company' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxYearsAtCompany?: number;

  // Years In Current Role
  @ApiPropertyOptional({ description: 'Minimum Years in Current Role' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minYearsInCurrentRole?: number;

  @ApiPropertyOptional({ description: 'Maximum Years in Current Role' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxYearsInCurrentRole?: number;

  // Years Since Last Promotion
  @ApiPropertyOptional({ description: 'Minimum Years Since Last Promotion' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minYearsSinceLastPromotion?: number;

  @ApiPropertyOptional({ description: 'Maximum Years Since Last Promotion' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxYearsSinceLastPromotion?: number;

  // Years With Current Manager
  @ApiPropertyOptional({ description: 'Minimum Years With Current Manager' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minYearsWithCurrManager?: number;

  @ApiPropertyOptional({ description: 'Maximum Years With Current Manager' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxYearsWithCurrManager?: number;

  // Training Times Last Year
  @ApiPropertyOptional({ description: 'Minimum Training Times Last Year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minTrainingTimesLastYear?: number;

  @ApiPropertyOptional({ description: 'Maximum Training Times Last Year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTrainingTimesLastYear?: number;

  // Training Hours Last Year
  @ApiPropertyOptional({ description: 'Minimum Training Hours Last Year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minTrainingHoursLastYear?: number;

  @ApiPropertyOptional({ description: 'Maximum Training Hours Last Year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTrainingHoursLastYear?: number;

  // Training Hours Last 6 Months
  @ApiPropertyOptional({ description: 'Minimum Training Hours Last 6 Months' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minTrainingHoursLast6Months?: number;

  @ApiPropertyOptional({ description: 'Maximum Training Hours Last 6 Months' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTrainingHoursLast6Months?: number;

  // Training Gap Score
  @ApiPropertyOptional({ description: 'Minimum Training Gap Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minTrainingGapScore?: number;

  @ApiPropertyOptional({ description: 'Maximum Training Gap Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTrainingGapScore?: number;

  // Distance From Home
  @ApiPropertyOptional({ description: 'Minimum Distance From Home' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minDistanceFromHome?: number;

  @ApiPropertyOptional({ description: 'Maximum Distance From Home' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxDistanceFromHome?: number;

  // Absence Days Last Month
  @ApiPropertyOptional({ description: 'Minimum Absence Days Last Month' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAbsenceDaysLastMonth?: number;

  @ApiPropertyOptional({ description: 'Maximum Absence Days Last Month' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAbsenceDaysLastMonth?: number;

  // Absence Days Last 3 Months
  @ApiPropertyOptional({ description: 'Minimum Absence Days Last 3 Months' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAbsenceDaysLast3Months?: number;

  @ApiPropertyOptional({ description: 'Maximum Absence Days Last 3 Months' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAbsenceDaysLast3Months?: number;

  // Absence Ratio (Float)
  @ApiPropertyOptional({ description: 'Minimum Absence Ratio (Float)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAbsenceRatio?: number;

  @ApiPropertyOptional({ description: 'Maximum Absence Ratio (Float)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAbsenceRatio?: number;

  // Late Arrivals
  @ApiPropertyOptional({ description: 'Minimum Late Arrivals Last Month' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minLateArrivalsLastMonth?: number;

  @ApiPropertyOptional({ description: 'Maximum Late Arrivals Last Month' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxLateArrivalsLastMonth?: number;

  // Overtime Hours (Float)
  @ApiPropertyOptional({
    description: 'Minimum Overtime Hours Last Month (Float)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minOvertimeHoursLastMonth?: number;

  @ApiPropertyOptional({
    description: 'Maximum Overtime Hours Last Month (Float)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxOvertimeHoursLastMonth?: number;

  // Workload Pressure
  @ApiPropertyOptional({ description: 'Minimum Workload Pressure Index' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minWorkloadPressureIndex?: number;

  @ApiPropertyOptional({ description: 'Maximum Workload Pressure Index' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxWorkloadPressureIndex?: number;

  // Engagement Score
  @ApiPropertyOptional({ description: 'Minimum Engagement Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minEngagementScore?: number;

  @ApiPropertyOptional({ description: 'Maximum Engagement Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxEngagementScore?: number;

  // Manager Feedback Score
  @ApiPropertyOptional({ description: 'Minimum Manager Feedback Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minManagerFeedbackScore?: number;

  @ApiPropertyOptional({ description: 'Maximum Manager Feedback Score' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxManagerFeedbackScore?: number;

  // Role Stability Ratio (Float)
  @ApiPropertyOptional({ description: 'Minimum Role Stability Ratio (Float)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRoleStabilityRatio?: number;

  @ApiPropertyOptional({ description: 'Maximum Role Stability Ratio (Float)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxRoleStabilityRatio?: number;

  @ApiPropertyOptional({
    description: 'Minimum Promotion Stagnation Ratio (Float)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPromotionStagnationRatio?: number;

  @ApiPropertyOptional({
    description: 'Maximum Promotion Stagnation Ratio (Float)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPromotionStagnationRatio?: number;
}
