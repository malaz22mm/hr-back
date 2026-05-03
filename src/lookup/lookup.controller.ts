import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LookupService } from './lookup.service';
import { AtAuthorizationHeader } from 'src/common/decorators/at-authorization.decorator';

@ApiTags('Lookups')
@AtAuthorizationHeader()
@Controller('lookups')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  async getDepartments() {
    return this.lookupService.getDepartments();
  }

  @Get('job-roles')
  @ApiOperation({ summary: 'Get all job roles' })
  async getJobRoles() {
    return this.lookupService.getJobRoles();
  }

  @Get('education-levels')
  @ApiOperation({ summary: 'Get all education levels' })
  async getEducationLevels() {
    return this.lookupService.getEducationLevels();
  }

  @Get('marital-statuses')
  @ApiOperation({ summary: 'Get all marital status types' })
  async getMaritalStatuses() {
    return this.lookupService.getMaritalStatuses();
  }

  @Get('shifts')
  @ApiOperation({ summary: 'Get all work shifts' })
  async getWorkShifts() {
    return this.lookupService.getWorkShifts();
  }

  @Get('vacation-statuses')
  @ApiOperation({ summary: 'Get all vacation request statuses' })
  async getRequestStatuses() {
    return this.lookupService.getRequestStatuses();
  }

  @Get('satisfaction-scales')
  @ApiOperation({ summary: 'Get the 1-5 satisfaction scale labels' })
  async getSatisfactionLevels() {
    return this.lookupService.getSatisfactionLevels();
  }
}