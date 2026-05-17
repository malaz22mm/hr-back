import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";

export class VerifingDto{
    @ApiProperty({description:"User UUID from sign-in verification response",example:"24b5d2c3-3da5-4d6e-9a4e-f088c75433f2"})
    @IsString()
    @IsUUID()
    userId:string;

    @ApiProperty({description:"5-digit OTP sent to email",example:12345})
    @Type(() => Number)
    @IsInt()
    @Min(10000)
    @Max(99999)
    code:number;
}