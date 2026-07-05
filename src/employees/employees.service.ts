import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Employees, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { EmployeeStatsDto } from './dto/employee-stats.dto';
// import { AttritionRiskClassMap, AttritionTypeMap, BusinessTravelTypeMap, DepartmentTypeMap, EducationFieldTypeMap, EducationLevelMap, JobRoleTypeMap, mapEnumValue, OvertimeTypeMap, PerformanceRatingMap } from './mappers/enum-mapper';



// I discovered that the try-catch around prisma is not needed:
//         Prisma throws an exception (promise rejection)
// NestJS automatically catches it at the framework level
//         When try/catch is justified
// You should use try/catch only if you translate or enrich the error.
@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) { }


  async findAll(params: EmployeeQueryDto) {
    const {
      skip = 0 // Default to 0 if undefined
      , take = 10 // Default to 10 if undefined
      , sortBy, sortOrder,
      // Range Filters
      minAge, maxAge, minJobLevel, maxJobLevel, minMonthlyIncome, maxMonthlyIncome,
      minPercentSalaryHike, maxPercentSalaryHike, minTotalWorkingYears, maxTotalWorkingYears,
      minNumCompaniesWorked, maxNumCompaniesWorked, minYearsAtCompany, maxYearsAtCompany,
      minYearsInCurrentRole, maxYearsInCurrentRole, minYearsSinceLastPromotion, maxYearsSinceLastPromotion,
      minYearsWithCurrManager, maxYearsWithCurrManager, minTrainingTimesLastYear, maxTrainingTimesLastYear,
      minTrainingHoursLastYear, maxTrainingHoursLastYear, minTrainingHoursLast6Months, maxTrainingHoursLast6Months,
      minTrainingGapScore, maxTrainingGapScore, minDistanceFromHome, maxDistanceFromHome,
      minAbsenceRatio, maxAbsenceRatio, minLateArrivalsLastMonth, maxLateArrivalsLastMonth,
      minOvertimeHoursLastMonth, maxOvertimeHoursLastMonth, minWorkloadPressureIndex, maxWorkloadPressureIndex,
      minEngagementScore, maxEngagementScore, minManagerFeedbackScore, maxManagerFeedbackScore,
      minRoleStabilityRatio, maxRoleStabilityRatio, minPromotionStagnationRatio, maxPromotionStagnationRatio,
      // Destructure ID Filters (Categorical)
      attrition, businessTravelId, departmentId, educationId, jobRoleId,
      maritalStatusId,healthStatusId, attritionRiskClassId, workShiftId, gender, overTime,
      // Destructure Rating IDs (Satisfaction)
      environmentSatisfactionId, jobInvolvementId, jobSatisfactionId,
      performanceRatingId, relationshipSatisfactionId, workLifeBalanceId,
    } = params;

    // Helper for numeric ranges
    const range = (min?: number, max?: number) => {
      if (min === undefined && max === undefined) return undefined;
      return { gte: min, lte: max };
    };
    // 1. Build the Relational/Categorical Filters
    const idFilters = {
      attrition,
      gender,
      over_time: overTime,
      business_travel_id: businessTravelId,
      department_id: departmentId,
      education_id: educationId,
      job_role_id: jobRoleId,
      marital_status_id: maritalStatusId,
      health_state_id: healthStatusId,
      attrition_risk_class_id: attritionRiskClassId,
      work_shift_id: workShiftId,
      // Satisfaction mappings
      environment_satisfaction_id: environmentSatisfactionId,
      job_involvement_id: jobInvolvementId,
      job_satisfaction_id: jobSatisfactionId,
      performance_rating_id: performanceRatingId,
      relationship_satisfaction_id: relationshipSatisfactionId,
      work_life_balance_id: workLifeBalanceId,
    };

    // 2. Construct Numeric Ranges (Snake_case alignment)
    const numericFilters = {
      age: range(minAge, maxAge),
      job_level: range(minJobLevel, maxJobLevel),
      monthly_income: range(minMonthlyIncome, maxMonthlyIncome),
      percent_salary_hike: range(minPercentSalaryHike, maxPercentSalaryHike),
      total_working_years: range(minTotalWorkingYears, maxTotalWorkingYears),
      num_of_companies_worked: range(minNumCompaniesWorked, maxNumCompaniesWorked),
      years_at_company: range(minYearsAtCompany, maxYearsAtCompany),
      years_in_current_role: range(minYearsInCurrentRole, maxYearsInCurrentRole),
      years_since_last_promotion: range(minYearsSinceLastPromotion, maxYearsSinceLastPromotion),
      years_with_curr_manager: range(minYearsWithCurrManager, maxYearsWithCurrManager),
      training_times_last_year: range(minTrainingTimesLastYear, maxTrainingTimesLastYear),
      training_hours_last_year: range(minTrainingHoursLastYear, maxTrainingHoursLastYear),
      training_hours_last_6_months: range(minTrainingHoursLast6Months, maxTrainingHoursLast6Months),
      training_gap_score: range(minTrainingGapScore, maxTrainingGapScore),
      distance_from_home: range(minDistanceFromHome, maxDistanceFromHome),
      late_arrivals_last_month: range(minLateArrivalsLastMonth, maxLateArrivalsLastMonth),
      workload_pressure_index: range(minWorkloadPressureIndex, maxWorkloadPressureIndex),
      engagement_score: range(minEngagementScore, maxEngagementScore),
      engagement_feedback_score: range(minManagerFeedbackScore, maxManagerFeedbackScore),
      role_stability_ratio: range(minRoleStabilityRatio, maxRoleStabilityRatio),
      promotion_stagnation_ratio: range(minPromotionStagnationRatio, maxPromotionStagnationRatio),
    };
    // 3. Merge and Cleanup undefined filters
    const where: Prisma.EmployeesWhereInput = {};
    const allFilters = { ...idFilters, ...numericFilters };


    for (const key in allFilters) {
      const value = allFilters[key as keyof typeof allFilters];
      if (value !== undefined) {
        (where as any)[key] = value;
      }
    }

    // 4. Sorting logic
    const orderBy: Prisma.EmployeesOrderByWithRelationInput[] = [];
    if (sortBy) {
      orderBy.push({ [sortBy]: sortOrder });
    }
    orderBy.push({ id: 'asc' });

    // 5. Execute Database Query with Joins
    const data = await this.prisma.employees.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        Department: true,
        JobRole: true,
        WorkShift: true,
        MaritalStatus: true,
        Education: true,
        BusinessTravel: true,
        EnvironmentSatisfaction: true,
        JobInvolvement: true,
        JobSatisfaction: true,
        PerformanceRating: true,
        RelationshipSat: true,
        WorkLifeBalance: true,
        HealthState:true
      },
    });

    const total = await this.prisma.employees.count({ where });

    return {
      data,
      meta: {
        total,
        skip,
        take,
        pages: Math.ceil(total / take)
      }
    };
  }


  async createEmployee(newEmp: CreateEmployeeDto) {
    try {
      return await this.prisma.employees.create({
        data: {
          ...newEmp, // Only if keys match schema exactly
          // Example if keys differ:
          // department_id: newEmp.departmentId, 
          // job_role_id: newEmp.jobRoleId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Employee already exists.');
      }
      throw error;
    }
  }


  async updateEmployee(params: UpdateEmployeeDto) {
    const { id, ...data } = params;

    try {
      return await this.prisma.employees.update({
        where: { id: Number(id) }, // Explicit cast to Int for schema compliance
        data: {
          ...data,
          // If your DTO doesn't match schema snake_case exactly, map them here:
          // department_id: data.departmentId,
          // work_shift_id: data.workShiftId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }


  async deleteEmployee(id: number): Promise<void> {

    // Enhancement:
    // The "Soft Delete" (Recommended for HR Systems)
    // Instead of removing the record, you add a deletedAt timestamp to the Employees model.
    //  This preserves the historical attendance and payroll data for legal/auditing reasons.
    try {
      await this.prisma.$transaction([
        // 1. Clean up dependent logs first
        this.prisma.attendance_Logs.deleteMany({ where: { emp_id: id } }),
        this.prisma.vacation_Request.deleteMany({ where: { emp_id: id } }),
        // 2. Delete the actual employee
        this.prisma.employees.delete({ where: { id } }),
      ]);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(`Cannot delete employee due to existing related data.`);
        }
      }
      throw error;
    }
  }


  async getStats(params: EmployeeStatsDto) {
    const { groupBy } = params; // e.g., 'department_id'

    const result = await this.prisma.employees.groupBy({
      by: [groupBy as any],
      _count: {
        id: true,
      },
      _avg: {
        monthly_income: true,
        age: true,
        years_at_company: true,
        engagement_score: true,
        workload_pressure_index: true,
      },
    });

    // Format and return
    return result.map((group) => {
      // Dynamic access using the snake_case key from DTO
      const groupId = group[groupBy as string];

      return {
        group: groupId, // Returning ID. Frontend can map or you can join labels here.
        count: group._count.id,
        averageSalary: Math.round(group._avg.monthly_income || 0),
        averageAge: Math.round(group._avg.age || 0),
        averageTenure: parseFloat((group._avg.years_at_company || 0).toFixed(1)),
        avgEngagement: parseFloat((group._avg.engagement_score || 0).toFixed(1)),
        avgWorkload: parseFloat((group._avg.workload_pressure_index || 0).toFixed(1)),
      };
    });
  }
}