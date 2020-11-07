import { createParamDecorator } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/user.interface';

export const GetUser = createParamDecorator((req, data): IUser => req.user);
