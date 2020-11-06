import * as mongoose from 'mongoose';
import { IsDateString, IsString } from 'class-validator';

export class CreateUserTokenDto {
    @IsString()
    token: string;

    @IsString()
    uId: mongoose.Types.ObjectId;

    @IsDateString()
    expiresAt: string;
}
