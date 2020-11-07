import {
    BadRequestException,
    Injectable,
    MethodNotAllowedException,
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
import { ITokenPayload } from './interfaces/token-payload.interface';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { userSensitiveFieldsEnum } from 'src/user/enums/protected-fields.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';

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

    async signIn({ email, password }: SignInDto): Promise<IReadableUser> {
        const user = await this.userService.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = await this.signUser(user);
            const readableUser = user.toObject() as IReadableUser;
            readableUser.accessToken = token;

            return _.omit<any>(readableUser, Object.values(userSensitiveFieldsEnum)) as IReadableUser;
        }

        throw new BadRequestException('Invalid credentials');
    }

    async signUser(user: IUser, withStatusCheck: boolean = true): Promise<string> {
        if (withStatusCheck && (user.status !== statusEnum.active)) {
            throw new MethodNotAllowedException();
        }

        const tokenPayload: ITokenPayload = {
            _id: user._id,
            status: user.status,
            roles: user.roles,
        }
        const token = await this.generateToken(tokenPayload);
        const expiresAt = moment().add(1, 'day').toISOString();

        await this.saveToken({
            token,
            expiresAt,
            uId: user._id,
        });

        return token;
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

    private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
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
        const token = await this.signUser(user, false);
        const confirmLink = `${this.clientAppUrl}/auth/confirm?token${token}`;

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

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user = await this.userService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        
        const token = await this.signUser(user);
        const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

        await this.mailerService.send({
            from: this.configService.get<string>('SITE_NAME'),
            to: user.email,
            subject: 'Verify User',
            text: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `
        })
    }
}
