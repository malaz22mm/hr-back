import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsInt, IsString, IsUUID, Max, Min, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsUUID()
    @ApiProperty({description:"User UUID",example:"24b5d2c3-3da5-4d6e-9a4e-f088c75433f2"})
    userId:string;

    @Type(() => Number)
    @IsInt()
    @Min(10000)
    @Max(99999)
    @ApiProperty({
        description: "OTP sent to email",
        example: 12345
    })
    code: number;

    @IsEmail()
    @ApiProperty({description:"Must match the user's registered email",example:"user@example.com"})
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({ minLength: 6, example: 'NewSecureP@ss123' })
    newPassword: string;
}