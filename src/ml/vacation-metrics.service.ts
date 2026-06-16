import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VacationMetrics } from './ml-feature.types';

@Injectable()
export class VacationMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(empId: number): Promise<VacationMetrics> {
    const grouped = await this.prisma.vacation_Request.groupBy({
      by: ['approval_status'],
      where: { emp_id: empId },
      _count: { _all: true },
    });

    let acceptedVacations = 0;
    let rejectedVacations = 0;

    for (const row of grouped) {
      if (row.approval_status === 1) {
        acceptedVacations = row._count._all;
      } else if (row.approval_status === 2) {
        rejectedVacations = row._count._all;
      }
    }

    return { acceptedVacations, rejectedVacations };
  }
}
