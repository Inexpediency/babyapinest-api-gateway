import {Body, Controller, Post, Query, ValidationPipe} from '@nestjs/common';
import {CreateUserDto} from '../user/dto/create-user.dto';
import {AuthService} from './auth.service';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signUp')
    async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<boolean> {
        return this.authService.signUp(createUserDto);
    }

    @Post('/confirm')
    async confirm(@Query(ValidationPipe) query: ConfirmAccountDto) {
        await this.authService.confirm(query.token);
    }
}
