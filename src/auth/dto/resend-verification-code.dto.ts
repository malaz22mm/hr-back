import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class UserIdDto{
    @ApiProperty({ example: '24b5d2c3-3da5-4d6e-9a4e-f088c75433f2' })
    @IsString()
    @IsUUID()
    userId:string;
}