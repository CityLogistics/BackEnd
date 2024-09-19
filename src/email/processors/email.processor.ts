import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../email.service';
import { ConfigService } from '@nestjs/config';
import {
  ADMIN_CREATED,
  DRIVER_APPROVED,
  DRIVER_CREATED,
  DRIVER_DECLINED,
  ORDER_ACCEPTED_DRIVER,
  ORDER_CREATED,
  ORDER_ASSIGNED_DRIVER,
  ORDER_DELIVERED,
  ORDER_PAYMENT_COMPLETED,
  ORDER_REJECTED_ADMIN,
  ORDER_REJECTED_DRIVER,
} from 'src/common/jobs';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  private readonly infoEmailFrom = this.config.get('INFO_EMAIL_FROM');

  constructor(
    private emailService: EmailService,
    private config: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case DRIVER_CREATED: {
        const { email, name } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Driver Enlistment Request Received',
          template: './new-driver',
          context: {
            name,
          },
        });
        return {};
      }
      case DRIVER_APPROVED: {
        const { email, name, password } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Request Accepted and Approved',
          template: './driver-application-approved',
          context: {
            name,
            password,
            email,
          },
        });
        return {};
      }
      case DRIVER_DECLINED: {
        const { email, name } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Request Declined',
          template: './driver-application-declined',
          context: {
            name,
          },
        });
        return {};
      }

      case ORDER_CREATED: {
        const { email, paymentUrl, order } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Order Request Received',
          template: './new-order',
          context: {
            paymentUrl,
            orderId: order.orderNo,
          },
        });
        return {};
      }
      case ORDER_PAYMENT_COMPLETED: {
        const { email, id, name } = job.data?.order ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Pickup Request Received',
          template: './order-payment-completed',
          context: {
            orderId: id,
            name,
          },
        });
        return {};
      }
      case ORDER_REJECTED_ADMIN: {
        const { order } = job.data ?? {};

        this.emailService.sendEmail({
          to: order.email,
          from: this.infoEmailFrom,
          subject: 'Pickup Request Rejected',
          template: './new-order',
          context: {
            name: order.name,
            orderId: order.id,
          },
        });
        return {};
      }
      case ORDER_ASSIGNED_DRIVER: {
        const { email, order } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Pickup Request Received',
          template: './order-assigned-driver',
          context: {
            orderId: order.id,
          },
        });
        return {};
      }
      case ORDER_ACCEPTED_DRIVER: {
        const { order, driver } = job.data ?? {};

        this.emailService.sendEmail({
          to: order.email,
          from: this.infoEmailFrom,
          subject: 'Pickup Request Received',
          template: './order-accepted-driver',
          context: {
            orderId: order.id,
            name: order.name,
            driverName: driver.name,
            driverPhone: driver.phone,
          },
        });
        return {};
      }
      case ORDER_REJECTED_DRIVER: {
        const { order, driver } = job.data ?? {};

        this.emailService.sendEmail({
          to: this.infoEmailFrom,
          from: this.infoEmailFrom,
          subject: 'Pickup Request Received',
          template: './new-order',
          context: {
            orderId: order.id,
            driverName: driver.name,
          },
        });
        return {};
      }
      case ORDER_DELIVERED: {
        const { email, paymentUrl, order } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Order Delivered',
          template: './new-order',
          context: {
            paymentUrl,
            orderId: order.id,
          },
        });
        return {};
      }

      case ADMIN_CREATED: {
        const { name, password, email } = job.data ?? {};

        this.emailService.sendEmail({
          to: email,
          from: this.infoEmailFrom,
          subject: 'Admin Account Created',
          template: './admin-created',
          context: {
            name,
            password,
            email,
          },
        });
        return {};
      }

      case 'concatenate': {
        break;
      }
    }
  }
}
