import { Document } from 'mongoose';
import { IAddress } from './address.interface';

export interface IUser extends Document {
    status: string;
    readonly email: string;
    readonly avatar: string;
    readonly avatar_id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly gender: string;
    readonly address: IAddress;
    readonly profession: string;
    readonly searchField: string;
    readonly phone: string;
    readonly roles: Array<string>;
    readonly password: string;
}
