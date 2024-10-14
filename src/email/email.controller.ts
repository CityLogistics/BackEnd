import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('test')
  testmail() {
    return this.emailService.sendEmail({
      to: 'ayomidedavid5624@gmail.com', // list of receivers
      from: 'info@mycitylogistics.ca', // sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      // text: 'welcome', // plaintext body
      // html: '<b>welcome</b>', // HTML body content
      template: './welcome',
      context: {
        name: 'david',
        confirmation_url: 'nsbsbvsb',
      },
    });
  }
}
