import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SignOptions } from 'jsonwebtoken';
import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';
import { IUserToken } from 'src/token/interfaces/user-token.interface';
import { IUser } from '../user/interfaces/user.interface';
import { roleEnum } from '../user/enums/role.enum';
import { MailerService } from '../mailer/mailer.service';
import { statusEnum } from '../user/enums/status.enum';
import moment from 'moment';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly clientAppUrl: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.clientAppUrl = this.configService.get<string>('CLIENT_APP_URL');
    }

    async signUp(createUserDto: CreateUserDto): Promise<boolean> {
        const user = await this.userService.create(createUserDto, [
            roleEnum.user,
        ]);
        this.sendConfirmation(user);

        return true;
    }

    async signIn(email, password): Promise<boolean> {
        return;
    }

    async confirm(token: string): Promise<IUser> {
        const data = await this.verifyToken(token);
        const user = await this.userService.find(data._id);

        await this.tokenService.delete(data._id, token);

        if (user && user.status === statusEnum.pending) {
            user.status = statusEnum.active;
            return user.save();
        }

        throw new BadRequestException('Confirmation error');
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

    private async sendConfirmation(user: IUser) {
        const expiresIn = 60 * 60 * 24 // 1d
        const tokenPayload = {
            _id: user._id,
            status: user.status,
            roles: user.roles,
        }
        const expiresAt = moment().add(1, 'day').toISOString();

        const token = await this.generateToken(tokenPayload, { expiresIn });
        const confirmLink = `${this.clientAppUrl}/auth/confirm?token${token}`;

        await this.saveToken(({ token, uId: user._id, expiresAt }));
        await this.mailerService.send({
            from: this.configService.get<string>('SITE_NAME'),
            to: user.email,
            subject: 'Verify User',
            text: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please confirm your email address <a href="${confirmLink}">here</a>.</p>
            `
        })
    }
}
