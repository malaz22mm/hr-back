import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LookupService } from './lookup.service';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';
import { LookupItemDto, WorkShiftDto } from '../common/dto/lookup-item.dto';

@ApiTags('Lookups')
@AtAuthorizationHeader()
@Controller('lookups')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get('departments')
  @ApiOperation({ summary: 'All departments' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getDepartments() {
    return this.lookupService.getDepartments();
  }

  @Get('job-roles')
  @ApiOperation({ summary: 'All job roles' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getJobRoles() {
    return this.lookupService.getJobRoles();
  }

  @Get('education-levels')
  @ApiOperation({ summary: 'All education levels' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getEducationLevels() {
    return this.lookupService.getEducationLevels();
  }

  @Get('marital-statuses')
  @ApiOperation({ summary: 'All marital statuses' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getMaritalStatuses() {
    return this.lookupService.getMaritalStatuses();
  }

  @Get('business-travel')
  @ApiOperation({ summary: 'All business travel types' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getBusinessTravelTypes() {
    return this.lookupService.getBusinessTravelTypes();
  }

  @Get('performance-ratings')
  @ApiOperation({ summary: 'All performance rating levels' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getPerformanceRatings() {
    return this.lookupService.getPerformanceRatings();
  }

  @Get('attrition-risk-classes')
  @ApiOperation({ summary: 'All attrition risk classes' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getAttritionRiskClasses() {
    return this.lookupService.getAttritionRiskClasses();
  }

  @Get('shifts')
  @ApiOperation({ summary: 'All work shifts' })
  @ApiOkResponse({ type: WorkShiftDto, isArray: true })
  @ApiUnauthorizedResponse()
  async getWorkShifts() {
    return this.lookupService.getWorkShifts();
  }

  @Get('vacation-statuses')
  @ApiOperation({ summary: 'Vacation request status labels (0=pending, 1=approved, 2=rejected)' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getRequestStatuses() {
    return this.lookupService.getRequestStatuses();
  }

  @Get('satisfaction-scales')
  @ApiOperation({ summary: 'Satisfaction scale labels (shared lookup table)' })
  @ApiOkResponse({ type: [LookupItemDto] })
  @ApiUnauthorizedResponse()
  async getSatisfactionLevels() {
    return this.lookupService.getSatisfactionLevels();
  }
}
