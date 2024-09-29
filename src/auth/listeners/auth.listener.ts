import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RESET_PASSWORD_INITIATED } from 'src/common/jobs';
import { ResetPasswordInitiatedEvent } from '../events/reset-password-initiated.event';

@Injectable()
export class AuthListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent(RESET_PASSWORD_INITIATED)
  async handleResetPasswordInitiatedEvent(event: ResetPasswordInitiatedEvent) {
    await this.emailQueue.add(RESET_PASSWORD_INITIATED, {
      email: event.email,
      token: event.token,
      name: event.name,
    });
  }
}
