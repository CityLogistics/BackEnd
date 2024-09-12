import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DriverCreatedEvent } from '../events/driver-created.event';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class DriverCreatedListener {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  @OnEvent('driver.created')
  async handleOrderCreatedEvent(event: DriverCreatedEvent) {
    // handle and process "OrderCreatedEvent" event

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const job = await this.emailQueue.add('driver.created', {
      foo: 'bar',
      event,
    });
  }
}
