import * as mongoose from 'mongoose';
import { IsString } from 'class-validator';

export class CreateUserTokenDto {
    @IsString()
    token: string;

    @IsString()
    uId: mongoose.Types.ObjectId;

    @IsString()
    expiresAt: string;
}
