import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    HttpCode,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
    ApiExtraModels,
    ApiParam,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

// Services & Guards
import { EmployeesService } from './employees.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AtAuthorizationHeader } from '../common/decorators/at-authorization.decorator';
import { UserRole } from '../../generated/prisma/enums';


// DTOs & Entities
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeStatsDto } from './dto/employee-stats.dto';
import { PaginatedEmployeesResponseDto } from './dto/paginated-employees.dto';
import { EmployeeStatsGroupDto } from './dto/employee-stats-response.dto';
import { AttritionPredictionService } from '../ml/attrition-prediction.service';
import { AttritionPredictionResponseDto } from '../ml/dto/attrition-prediction-response.dto';

@ApiTags('Employees')
@AtAuthorizationHeader()
@Controller('employees')
@ApiExtraModels(EmployeeEntity, PaginatedEmployeesResponseDto, EmployeeStatsGroupDto)
export class EmployeesController {
    constructor(
        private readonly employeesService: EmployeesService,
        private readonly attritionPredictionService: AttritionPredictionService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Query employees',
        description:
            'Retrieve a paginated list of employees with comprehensive filtering capabilities (ranges, enums, exact matches) and sorting.',
    })
    @ApiOkResponse({
        description: 'Paginated employee list with relation includes',
        type: PaginatedEmployeesResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters (e.g. invalid enum value or number type).',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.',
    })
    async findAll(@Query() query: EmployeeQueryDto) {
        return this.employeesService.findAll(query);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Create an employee',
        description: 'Creates a new employee. Restricted to SUPER_ADMIN users only.',
    })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateEmployeeDto,
        required: true,
        description: 'New employee data without id',
    })
    @ApiCreatedResponse({
        description: 'Employee created successfully',
        type: EmployeeEntity,
    })
    @ApiBadRequestResponse({ description: 'Invalid payload or validation error' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
    @ApiForbiddenResponse({ description: 'User is not SUPER_ADMIN' })
    async createEmployee(@Body() newEmp: CreateEmployeeDto) {
        return this.employeesService.createEmployee(newEmp);
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Update an employee',
        description: 'Updates an existing employee. Restricted to SUPER_ADMIN users only.',
    })
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateEmployeeDto,
        required: true,
        description: 'Complete employee data including a valid employee id',
    })
    @ApiOkResponse({
        description: 'Employee updated successfully',
        type: EmployeeEntity,
    })
    @ApiBadRequestResponse({ description: 'Invalid payload or validation error' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
    @ApiForbiddenResponse({ description: 'User is not SUPER_ADMIN' })
    @ApiNotFoundResponse({ description: 'Employee with the given id was not found' })
    async updateEmployee(@Body() updatedEmp: UpdateEmployeeDto) {
        return this.employeesService.updateEmployee(updatedEmp);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete an employee',
        description: 'Restricted to SUPER_ADMIN.',
    })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'Employee integer ID', example: 42, type: Number })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Employee deleted successfully.',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Requires SUPER_ADMIN role.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee not found.',
    })
    async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
        return this.employeesService.deleteEmployee(id);
    }


    @Get(':id/predictions/attrition')
    @ApiOperation({
        summary: 'Predict employee attrition risk',
        description:
            'Runs the trained attrition ML model on live employee data. Uses ONNX inference in-process (or Python locally when ML_BACKEND=python).',
    })
    @ApiParam({ name: 'id', description: 'Employee integer ID', example: 0, type: Number })
    @ApiOkResponse({
        description: 'Attrition prediction result',
        type: AttritionPredictionResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Employee not found' })
    @ApiInternalServerErrorResponse({ description: 'ML model unavailable' })
    async predictAttrition(@Param('id', ParseIntPipe) id: number) {
        return this.attritionPredictionService.predictForEmployee(id);
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Get employee statistics (Aggregation)',
        description: 'Aggregates employee data by a specific category (e.g., Department, JobRole). Returns counts and averages for key metrics like Monthly Income, Age, and Satisfaction scores.',
    })
    @ApiOkResponse({
        description: 'Aggregation results by lookup ID',
        type: [EmployeeStatsGroupDto],
    })
    @ApiBadRequestResponse({ description: 'Invalid groupBy field provided.' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error during aggregation.' })
    async getStats(@Query() query: EmployeeStatsDto) {
        return this.employeesService.getStats(query);
    }
}