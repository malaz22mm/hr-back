import { Employees } from '../../generated/prisma/client';
import {
  AttendanceMetrics,
  MlAttritionFeatures,
  VacationMetrics,
} from './ml-feature.types';

export function toMlAttritionFeatures(
  employee: Employees,
  attendance: AttendanceMetrics,
  vacations: VacationMetrics,
): MlAttritionFeatures {
  return {
    age: employee.age,
    gender: employee.gender ? 1 : 0,
    marital_status_id: employee.marital_status_id,
    distance_from_home: employee.distance_from_home,
    hourly_rate: employee.hourly_rate,
    daily_rate: employee.daily_rate,
    monthly_rate: employee.monthly_rate,
    monthly_income: employee.monthly_income,
    percent_salary_hike: employee.percent_salary_hike,
    job_level: employee.job_level,
    health_state_id: employee.health_state_id,
    job_role_id: employee.job_role_id,
    business_travel_id: employee.business_travel_id,
    department_id: employee.department_id,
    education_id: employee.education_id,
    num_of_companies_worked: employee.num_of_companies_worked,
    total_working_years: employee.total_working_years,
    training_times_last_year: employee.training_times_last_year,
    years_at_company: employee.years_at_company,
    years_in_current_role: employee.years_in_current_role,
    years_since_last_promotion: employee.years_since_last_promotion,
    years_with_curr_manager: employee.years_with_curr_manager,
    stock_option_level: employee.stock_option_level,
    environment_satisfaction_id: employee.environment_satisfaction_id,
    job_involvement_id: employee.job_involvement_id,
    job_satisfaction_id: employee.job_satisfaction_id,
    performance_rating_id: employee.performance_rating_id,
    relationship_satisfaction_id: employee.relationship_satisfaction_id,
    work_life_balance_id: employee.work_life_balance_id,
    over_time: employee.over_time ? 1 : 0,
    workload_pressure_index: employee.workload_pressure_index,
    engagement_score: employee.engagement_score,
    engagement_feedback_score: employee.engagement_feedback_score,
    training_hours_last_year: employee.training_hours_last_year,
    training_hours_last_6_months: employee.training_hours_last_6_months,
    training_gap_score: employee.training_gap_score,
    promotion_stagnation_ratio: employee.promotion_stagnation_ratio,
    role_stability_ratio: employee.role_stability_ratio,
    over_time_hours_last_month: attendance.overTimeHoursLastMonth,
    late_arrivals_last_month: attendance.lateArrivalsLastMonth,
    absence_days_last_month: attendance.absenceDaysLastMonth,
    absence_ratio: attendance.absenceRatio,
    work_shift_id: employee.work_shift_id,
    accepted_vacations: vacations.acceptedVacations,
    rejected_vacations: vacations.rejectedVacations,
  };
}

export function mapProbabilityToRiskLevel(probability: number): {
  riskLevel: 'Low' | 'Medium' | 'High';
  suggestedAttritionRiskClassId: number;
} {
  if (probability < 0.3) {
    return { riskLevel: 'Low', suggestedAttritionRiskClassId: 1 };
  }
  if (probability <= 0.7) {
    return { riskLevel: 'Medium', suggestedAttritionRiskClassId: 2 };
  }
  return { riskLevel: 'High', suggestedAttritionRiskClassId: 3 };
}
