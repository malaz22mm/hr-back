import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { toMlAttritionFeatures } from './ml-feature.mapper';
import { MlAttritionFeatures } from './ml-feature.types';
import { AttendanceMetricsService } from './attendance-metrics.service';
import { VacationMetricsService } from './vacation-metrics.service';

@Injectable()
export class FeatureAssemblyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attendanceMetrics: AttendanceMetricsService,
    private readonly vacationMetrics: VacationMetricsService,
  ) {}

  async assemble(employeeId: number): Promise<{
    employeeName: string;
    features: MlAttritionFeatures;
  }> {
    const employee = await this.prisma.employees.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${employeeId} not found`);
    }

    const [attendance, vacations] = await Promise.all([
      this.attendanceMetrics.getMetrics(employeeId),
      this.vacationMetrics.getMetrics(employeeId),
    ]);

    return {
      employeeName: employee.name,
      features: toMlAttritionFeatures(employee, attendance, vacations),
    };
  }
}
