import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class LookupService {
  constructor(private prisma: PrismaService) {}

  async getDepartments() {
    return this.prisma.departmentType.findMany({ orderBy: { name: 'asc' } });
  }

  async getJobRoles() {
    return this.prisma.jobRoleType.findMany({ orderBy: { name: 'asc' } });
  }

  async getEducationLevels() {
    return this.prisma.education.findMany({ orderBy: { id: 'asc' } });
  }

  async getMaritalStatuses() {
    return this.prisma.maritalStatus.findMany({ orderBy: { name: 'asc' } });
  }

  async getBusinessTravelTypes() {
    return this.prisma.businessTravel.findMany({ orderBy: { id: 'asc' } });
  }

  async getWorkShifts() {
    return this.prisma.workShift.findMany({ orderBy: { id: 'asc' } });
  }

  async getAttritionRiskClasses() {
    return this.prisma.attritionRiskClass.findMany({ orderBy: { id: 'asc' } });
  }

  async getRequestStatuses() {
    return this.prisma.requestStatus.findMany({ orderBy: { id: 'asc' } });
  }

  async getSatisfactionLevels() {
    return this.prisma.satisfaction.findMany({ orderBy: { id: 'asc' } });
  }

  async getPerformanceRatings() {
    return this.prisma.performanceRating.findMany({ orderBy: { id: 'asc' } });
  }
}