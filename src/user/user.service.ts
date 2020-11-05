import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from './interfaces/user.interface' 

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

    async create() {
        return null
    }

    async find() {
        return null
    }
}
