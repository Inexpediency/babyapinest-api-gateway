import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user/user.module';
import { configModule } from 'src/configure.root';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { JwtStrategy } from './jwt.strategy';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    imports: [
        UserModule,
        TokenModule,
        configModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        MailerService,
    ],
    providers: [AuthService, JwtStrategy, MailerService],
    controllers: [AuthController],
})
export class AuthModule {}
