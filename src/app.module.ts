import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { configModule } from './configure.root';
import { TokenModule } from './token/token.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
    imports: [
        AuthModule,
        UserModule,

        configModule,

        MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }),

        TokenModule,

        MailerModule,
    ],
})
export class AppModule {}
