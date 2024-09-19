import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ADMIN_CREATED } from 'src/common/jobs';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent(ADMIN_CREATED)
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    await this.emailQueue.add(ADMIN_CREATED, {
      email: event.user.email,
      name: event.user.firstName,
      password: event.password,
    });
  }
}
