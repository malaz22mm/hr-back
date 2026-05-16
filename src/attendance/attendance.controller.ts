import { Controller, Post, Get, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';

@ApiTags('Attendance')
@AtAuthorizationHeader()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post('punch')
  @ApiOperation({ summary: 'Hardware Entry Point: Blip ID to Check-in/out' })
  async punch(@Body('empId') empId: number) {
    return this.service.punch(empId);
  }

  @Get('presence')
  @ApiOperation({ summary: 'Currently in the office' })
  async getPresence() {
    return this.service.getWhoIsIn();
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Detailed history for an employee' })
  async getHistory(
    @Param('id', ParseIntPipe) id: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    // Default to last 7 days if no dates provided
    const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = end ? new Date(end) : new Date();
    
    return this.service.getEmployeeHistory(id, startDate, endDate);
  }
}