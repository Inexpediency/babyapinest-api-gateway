import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDto } from './dto/mail.dto';

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService) {}

    send(mailDto: MailDto): void {
        const mailerServerUrl = this.configService.get<string>('MAILER_SERVER');
    }
}
