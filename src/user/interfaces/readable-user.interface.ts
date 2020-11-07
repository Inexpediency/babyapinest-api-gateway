import { IAddress } from './address.interface';

export interface IReadableUser {
    status: string;
    readonly email: string;
    readonly avatar: string;
    readonly avatarId: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly gender: string;
    readonly address: IAddress;
    readonly profession: string;
    readonly phone: string;
    readonly roles: string[];
    accessToken?: string;
}
