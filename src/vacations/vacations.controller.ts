import { Controller, Post, Get, Patch, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';

@ApiTags('Vacations')
@AtAuthorizationHeader()
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @ApiOperation({ summary: 'Employee: Submit a new vacation request' })
  async create(
    @Body('empId', ParseIntPipe) empId: number,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('reason') reason: string,
  ) {
    return this.vacationsService.createRequest(empId, new Date(startDate), new Date(endDate), reason);
  }

  @Get('employee/:empId')
  @ApiOperation({ summary: 'Employee: View my request history' })
  async getMyRequests(@Param('empId', ParseIntPipe) empId: number) {
    return this.vacationsService.getEmployeeRequests(empId);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: View all company requests (filter by status optional)' })
  async getAll(@Query('status') status?: string) {
    const statusId = status !== undefined ? parseInt(status) : undefined;
    return this.vacationsService.getAllRequests(statusId);
  }

  @Patch(':id/process')
  @ApiOperation({ summary: 'Admin: Approve or Reject a request' })
  async process(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminId') adminId: string, // In real app, get from Auth/JWT
    @Body('statusId', ParseIntPipe) statusId: number,
  ) {
    return this.vacationsService.processRequest(id, adminId, statusId);
  }
}