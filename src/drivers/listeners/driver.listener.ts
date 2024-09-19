import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DriverCreatedEvent } from '../events/driver-created.event';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DRIVER_APPROVED,
  DRIVER_CREATED,
  DRIVER_DECLINED,
} from 'src/common/jobs';
import { DriverApprovedEvent } from '../events/driver-approved.event';
import { DriverDeclinedEvent } from '../events/driver-declined.event';

@Injectable()
export class DriverListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent(DRIVER_CREATED)
  async handleDriverCreatedEvent(event: DriverCreatedEvent) {
    await this.emailQueue.add(DRIVER_CREATED, {
      email: event.driver.email,
      name: event.driver.firstName,
    });
  }

  @OnEvent(DRIVER_APPROVED)
  async handleDriverApprovedEvent(event: DriverApprovedEvent) {
    await this.emailQueue.add(DRIVER_APPROVED, {
      email: event.driver.email,
      name: event.driver.firstName,
      password: event.password,
    });
  }

  @OnEvent(DRIVER_DECLINED)
  async handleDriverDeclinedEvent(event: DriverDeclinedEvent) {
    await this.emailQueue.add(DRIVER_DECLINED, {
      email: event.driver.email,
      name: event.driver.firstName,
    });
  }
}
