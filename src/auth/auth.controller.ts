import {
    Body,
    Controller,
    Logger,
    Patch,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfirmAccountDto } from './dto/confirm-account-dto';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from 'src/components/decorators/get-user.decorator';
import { IUser } from 'src/user/interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('/signUp')
    async signUp(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<boolean> {
        this.logger.log(`Sign up with data: ${JSON.stringify(createUserDto)}`);

        return this.authService.signUp(createUserDto);
    }

    @Post('/confirm')
    async confirm(@Query(ValidationPipe) query: ConfirmAccountDto) {
        this.logger.log(`Confirm mail with data: ${JSON.stringify(query)}`);

        await this.authService.confirm(query.token);
    }

    @Post('/signIn')
    async signIn(
        @Body(ValidationPipe) signInDto: SignInDto,
    ): Promise<IReadableUser> {
        this.logger.log(`Sign in with data: ${JSON.stringify(signInDto)}`);

        return this.authService.signIn(signInDto);
    }

    @Post('/forgotPassword')
    async forgotPassword(
        @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
    ): Promise<void> {
        this.logger.log(
            `Recovery frogot password with data: ${JSON.stringify(
                forgotPasswordDto,
            )}`,
        );

        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Patch('/changePassword')
    async changePassword(
        @GetUser() user: IUser,
        @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    ): Promise<boolean> {
        this.logger.log(
            `Change password with data: ${JSON.stringify(changePasswordDto)}`,
        );

        return this.authService.changePassword(user._id, changePasswordDto);
    }
}
