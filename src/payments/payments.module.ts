import { Module } from '@nestjs/common';
import { StripeService } from './payments.service';
import { StripeCheckoutController } from './stripe.checkout.controller';
import { StripeWebhookController } from './stripe.webhook.controller';

@Module({
  imports: [],
  controllers: [StripeCheckoutController, StripeWebhookController],
  providers: [StripeService],
})
export class PaymentsModule {}
