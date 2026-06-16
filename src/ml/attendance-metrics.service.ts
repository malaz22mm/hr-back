import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AttendanceMetrics } from './ml-feature.types';

const WINDOW_DAYS = 30;

@Injectable()
export class AttendanceMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(empId: number): Promise<AttendanceMetrics> {
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - WINDOW_DAYS);

    const logs = await this.prisma.attendance_Logs.findMany({
      where: {
        emp_id: empId,
        check_in: { gte: windowStart },
      },
      include: { WorkShift: true },
    });

    if (logs.length === 0) {
      return {
        overTimeHoursLastMonth: 0,
        lateArrivalsLastMonth: 0,
        absenceDaysLastMonth: 0,
        absenceRatio: 0,
      };
    }

    let lateArrivals = 0;
    let overtimeHours = 0;
    const presentDays = new Set<string>();

    for (const log of logs) {
      const checkIn = new Date(log.check_in);
      presentDays.add(checkIn.toISOString().slice(0, 10));

      const shiftStart = this.timeOnDate(checkIn, log.WorkShift.start_time);
      const shiftEnd = this.timeOnDate(checkIn, log.WorkShift.end_time);
      const graceMs = log.WorkShift.grace_period_minutes * 60_000;

      if (checkIn.getTime() > shiftStart.getTime() + graceMs) {
        lateArrivals += 1;
      }

      if (log.check_out) {
        const checkOut = new Date(log.check_out);
        const overtimeMs = checkOut.getTime() - shiftEnd.getTime();
        if (overtimeMs > 0) {
          overtimeHours += overtimeMs / 3_600_000;
        }
      }
    }

    const expectedWorkDays = this.countWeekdays(windowStart, new Date());
    const absenceDays = Math.max(0, expectedWorkDays - presentDays.size);
    const absenceRatio =
      expectedWorkDays > 0 ? absenceDays / expectedWorkDays : 0;

    return {
      overTimeHoursLastMonth: Math.round(overtimeHours * 1000) / 1000,
      lateArrivalsLastMonth: lateArrivals,
      absenceDaysLastMonth: absenceDays,
      absenceRatio: Math.round(absenceRatio * 1_000_000) / 1_000_000,
    };
  }

  private timeOnDate(baseDate: Date, timeSource: Date): Date {
    const result = new Date(baseDate);
    result.setHours(
      timeSource.getHours(),
      timeSource.getMinutes(),
      timeSource.getSeconds(),
      0,
    );
    return result;
  }

  private countWeekdays(start: Date, end: Date): number {
    let count = 0;
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (cursor <= endDay) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) {
        count += 1;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }
}
