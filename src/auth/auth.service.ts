import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SignOptions } from 'jsonwebtoken';
import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';
import { IUserToken } from 'src/token/interfaces/user-token.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    signUp(createUserDto: CreateUserDto) {
        return;
    }

    signIn(email, password) {
        return;
    }

    private async generateToken(data, options?: SignOptions): Promise<string> {
        return this.jwtService.sign(data, options);
    }

    private async verifyToken(token): Promise<any> {
        const data = this.jwtService.verify(token);
        const tokenExists = await this.tokenService.exists(data._id, token);

        if (!tokenExists) {
            throw new UnauthorizedException();
        }

        return data;
    }

    private saveToken(
        createUserTokenDto: CreateUserTokenDto,
    ): Promise<IUserToken> {
        return this.tokenService.create(createUserTokenDto);
    }
}
