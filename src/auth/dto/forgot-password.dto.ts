import { ApiProperty } from "@nestjs/swagger";
import { IsEAN, IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
