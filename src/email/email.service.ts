import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail() {
    const t = await this.mailerService.sendMail({
      to: 'ayomidedavid5624@gmail.com', // list of receivers
      from: 'info@mycitylogistics.com', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });

    console.info(t);
    return t;
  }
}
