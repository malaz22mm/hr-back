import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';
import { PunchDto } from './dto/punch.dto';
import { AttendanceHistoryQueryDto } from './dto/attendance-history-query.dto';

@ApiTags('Attendance')
@AtAuthorizationHeader()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post('punch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check-in or check-out (smart punch)',
    description:
      'If the employee has an open session (check_out is null), records check-out; otherwise creates check-in using the employee work shift.',
  })
  @ApiBody({ type: PunchDto })
  @ApiOkResponse({
    description: 'Attendance log created or updated',
    schema: {
      example: {
        id: 1,
        emp_id: 42,
        shift_id: 1,
        check_in: '2025-05-17T08:00:00.000Z',
        check_out: null,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Employee not found (on check-in)' })
  @ApiUnauthorizedResponse()
  async punch(@Body() dto: PunchDto) {
    return this.service.punch(dto.empId);
  }

  @Get('presence')
  @ApiOperation({ summary: 'Employees currently checked in (no check-out)' })
  @ApiOkResponse({
    description: 'Active attendance sessions with employee summary',
    schema: { type: 'array', items: { type: 'object' } },
  })
  @ApiUnauthorizedResponse()
  async getPresence() {
    return this.service.getWhoIsIn();
  }

  @Get('employee/:id')
  @ApiOperation({
    summary: 'Attendance history for one employee',
    description: 'Optional `start` and `end` ISO dates; defaults to last 7 days through today.',
  })
  @ApiParam({ name: 'id', type: Number, example: 42 })
  @ApiOkResponse({
    description: 'Attendance logs with WorkShift',
    schema: { type: 'array', items: { type: 'object' } },
  })
  @ApiBadRequestResponse({ description: 'Invalid date query' })
  @ApiUnauthorizedResponse()
  async getHistory(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AttendanceHistoryQueryDto,
  ) {
    const startDate = query.start
      ? new Date(query.start)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = query.end ? new Date(query.end) : new Date();

    return this.service.getEmployeeHistory(id, startDate, endDate);
  }
}
