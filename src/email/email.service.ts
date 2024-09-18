import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(options: ISendMailOptions) {
    const mail = await this.mailerService.sendMail(options);
    return mail;
  }
}
