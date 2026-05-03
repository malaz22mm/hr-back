import { ApiProperty, PartialType } from "@nestjs/swagger";
import { BaseEmployeeDto } from "./base.employee.dto";
import { IsInt, IsNotEmpty } from "class-validator";

/**
 * UpdateEmployeeDto
 * Inherits all fields from BaseEmployeeDto but makes them optional 
 * for PATCH requests, while requiring a valid Integer ID.
 */
export class UpdateEmployeeDto extends PartialType(BaseEmployeeDto) {
    @ApiProperty({
        example: 1,
        description: "The unique integer ID of the employee",
    })
    @IsInt()
    @IsNotEmpty()
    id: number;
}