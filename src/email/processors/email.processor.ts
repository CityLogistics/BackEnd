import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../email.service';

@Processor('email')
export class AudioConsumer extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'driver.created': {
        this.emailService.sendEmail();
        return {};
      }
      case 'concatenate': {
        break;
      }
    }
  }
}
