import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * The "Smart Punch": Automatically determines whether to Check-in or Check-out.
   */
  async punch(empId: number) {
    const today = new Date();

    // 1. Check for an active session (check_out is null)
    const activeLog = await this.prisma.attendance_Logs.findFirst({
      where: { emp_id: empId, check_out: null },
      orderBy: { check_in: 'desc' },
    });

    if (activeLog) {
      // Logic: If already checked in, perform a Check-out
      return this.prisma.attendance_Logs.update({
        where: { id: activeLog.id },
        data: { check_out: today },
      });
    }

    // 2. Logic: Perform a Check-in
    const employee = await this.prisma.employees.findUnique({
      where: { id: empId },
      include: { WorkShift: true },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.attendance_Logs.create({
      data: {
        emp_id: empId,
        shift_id: employee.work_shift_id,
        check_in: today,
        // Optional: In a production env, you'd calculate 'is_late' 
        // here and store it if your schema has that field.
      },
    });
  }

  /**
   * Flexible History Query: Handles Week, Month, or Custom ranges.
   */
  async getEmployeeHistory(empId: number, startDate: Date, endDate: Date) {
    return this.prisma.attendance_Logs.findMany({
      where: {
        emp_id: empId,
        check_in: { gte: startDate, lte: endDate },
      },
      include: { WorkShift: true },
      orderBy: { check_in: 'desc' },
    });
  }

  /**
   * Real-time Presence: Returns everyone currently in the building.
   */
  async getWhoIsIn() {
    return this.prisma.attendance_Logs.findMany({
      where: { check_out: null },
      include: {
        Employee: {
          select: { name: true, department_id: true, Department: true }
        }
      }
    });
  }
}