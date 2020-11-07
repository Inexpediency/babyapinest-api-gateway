import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {ConfirmAccountDto} from './dto/confirm-account-dto';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signUp')
    async signUp(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<boolean> {
        return this.authService.signUp(createUserDto);
    }

    @Post('/confirm')
    async confirm(@Query(ValidationPipe) query: ConfirmAccountDto) {
        await this.authService.confirm(query.token);
    }

    @Post('/signIn')
    async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<IReadableUser> {
        return this.authService.signIn(signInDto);
    }
}
