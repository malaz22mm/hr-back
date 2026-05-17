import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VacationsService } from './vacations.service';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';
import { CreateVacationRequestDto } from './dto/create-vacation-request.dto';
import { ProcessVacationRequestDto } from './dto/process-vacation-request.dto';

@ApiTags('Vacations')
@AtAuthorizationHeader()
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit a vacation request',
    description: 'Creates a pending request (`approval_status: 0`). Validates dates and overlaps.',
  })
  @ApiBody({ type: CreateVacationRequestDto })
  @ApiCreatedResponse({ description: 'Vacation request created' })
  @ApiBadRequestResponse({ description: 'Invalid dates or overlapping request' })
  @ApiUnauthorizedResponse()
  async create(@Body() dto: CreateVacationRequestDto) {
    return this.vacationsService.createRequest(
      dto.empId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.reason,
    );
  }

  @Get('employee/:empId')
  @ApiOperation({ summary: 'List vacation requests for one employee' })
  @ApiParam({ name: 'empId', type: Number, example: 42 })
  @ApiOkResponse({ description: 'Requests with status and processor', schema: { type: 'array', items: { type: 'object' } } })
  @ApiUnauthorizedResponse()
  async getMyRequests(@Param('empId', ParseIntPipe) empId: number) {
    return this.vacationsService.getEmployeeRequests(empId);
  }

  @Get()
  @ApiOperation({
    summary: 'List all vacation requests (admin)',
    description: 'Optional filter by approval status ID (0=pending, 1=approved, 2=rejected).',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description: 'RequestStatus id',
    example: 0,
  })
  @ApiOkResponse({ schema: { type: 'array', items: { type: 'object' } } })
  @ApiUnauthorizedResponse()
  async getAll(@Query('status') status?: string) {
    const statusId = status !== undefined ? parseInt(status, 10) : undefined;
    return this.vacationsService.getAllRequests(statusId);
  }

  @Patch(':id/process')
  @ApiOperation({
    summary: 'Approve or reject a request',
    description: 'statusId: 1 = approved, 2 = rejected. Sets processed_by and processed_at.',
  })
  @ApiParam({ name: 'id', type: Number, example: 10 })
  @ApiBody({ type: ProcessVacationRequestDto })
  @ApiOkResponse({ description: 'Updated request with relations' })
  @ApiBadRequestResponse({ description: 'Invalid statusId' })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async process(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessVacationRequestDto,
  ) {
    return this.vacationsService.processRequest(id, dto.adminId, dto.statusId);
  }
}
