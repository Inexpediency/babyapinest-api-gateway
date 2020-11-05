import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { configModule } from 'src/configure.root';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UserModule,
        // TokenModule,
        configModule,
        PassportModule.register({ defaultStrategy:  'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
