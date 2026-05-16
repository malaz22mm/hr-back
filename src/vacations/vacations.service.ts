import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {  Prisma } from 'generated/prisma/client';
@Injectable()
export class VacationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new request. Initial status is always '0' (Pending).
   */
  // async createRequest(empId: number, startDate: Date, endDate: Date, reason: string) {
  //   // Validate dates
  //   if (new Date(startDate) > new Date(endDate)) {
  //     throw new BadRequestException('Start date cannot be after end date');
  //   }

  //   return await this.prisma.vacation_Request.create({
  //     data: {
  //       emp_id: empId,
  //       start_date: startDate,
  //       end_date: endDate,
  //       reason: reason,
  //       approval_status: 0, // Maps to 'PENDING' in our MasterSeed
  //       // Note: processed_by is null until an Admin acts on it
  //     },
  //   });
  // }

  /**
   * Admin-only: Approve or Reject a request.
   * Links the request to the Admin's User UUID.
   */
  async processRequest(requestId: number, adminId: string, statusId: number) {
    // 1. Verify status is valid (1 for Approved, 2 for Rejected)
    if (![1, 2].includes(statusId)) {
      throw new BadRequestException('Invalid status transition');
    }

    try {
      return await this.prisma.vacation_Request.update({
        where: { id: requestId },
        data: {
          approval_status: statusId,
          processed_by: adminId, // Audit link to Users.id
          processed_at: new Date(),
        },
        include: {
          Employee: true,
          RequestStatus: true,
          Processor: {
            select: { name: true, email: true } // Return admin details
          }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Vacation request ${requestId} not found`);
      }
      throw error;
    }
  }

  /**
   * Fetches requests with full relational context.
   */
  async getEmployeeRequests(empId: number) {
    return await this.prisma.vacation_Request.findMany({
      where: { emp_id: empId },
      include: {
        RequestStatus: true,
        Processor: { select: { name: true } }
      },
      orderBy: { requested_at: 'desc' }
    });
  }


  // Add these logic checks to your existing createRequest method:

async createRequest(empId: number, startDate: Date, endDate: Date, reason: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // 1. Prevent past requests
  if (start < now) {
    throw new BadRequestException('Cannot request vacation for past dates');
  }

  if (start > end) {
    throw new BadRequestException('Start date cannot be after end date');
  }

  // 2. Prevent overlapping requests
  const overlap = await this.prisma.vacation_Request.findFirst({
    where: {
      emp_id: empId,
      approval_status: { in: [0, 1] }, // Only check Pending or Approved
      OR: [
        { start_date: { lte: end }, end_date: { gte: start } },
      ],
    },
  });

  if (overlap) {
    throw new BadRequestException('Dates overlap with an existing vacation request');
  }

  return await this.prisma.vacation_Request.create({
    data: {
      emp_id: empId,
      start_date: start,
      end_date: end,
      reason,
      approval_status: 0,
    },
  });
}

// 3. Add this for Admin Dashboard use
async getAllRequests(status?: number) {
  return await this.prisma.vacation_Request.findMany({
    where: status !== undefined ? { approval_status: status } : {},
    include: {
      Employee: { select: { name: true, department_id: true } },
      RequestStatus: true,
    },
    orderBy: { requested_at: 'desc' },
  });
}
}