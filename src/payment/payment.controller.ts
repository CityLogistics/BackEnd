import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private config: ConfigService,
  ) {}
  @Post('/webhook')
  async webhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig,
  ) {
    const endpointSecret = this.config.get('STRIPE_ENDPOINT_SECRET');

    let event: Stripe.Event;
    try {
      event = this.paymentService.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case 'checkout.session.completed':
        const session: Stripe.Checkout.Session = event.data.object;
        console.info({ session });
        this.paymentService.updatePaymentStatus(
          session.metadata['orderId'],
          session.amount_total,
        );
        // Then define and call a function to handle the event invoice.payment_succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
