// webhooks.controller.ts
import { Controller, Post, Req, Res, HttpStatus, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Public } from 'src/commons/decorators/public.decorators';

@ApiTags('Webhooks')
@Controller('webhooks')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  @Public()
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiHeader({
    name: 'Stripe-Signature',
    description: 'Stripe webhook signature',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Webhook received' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async stripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET_KEY is not set.');
      return response.sendStatus(HttpStatus.BAD_REQUEST);
    }

    let event: Stripe.Event;

    try {
      // Use the raw body for signature verification
      const rawBody = (request as any).rawBody;

      event = this.stripeService.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('⚠️  Webhook signature verification failed.', errorMessage);
      return response.sendStatus(HttpStatus.BAD_REQUEST);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.stripeService.handleProcessWebhookCheckout(event.data);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.stripeService.handleProcessWebhookUpdatedSubscription(event.data);
          break;
        case 'customer.subscription.deleted':
          await this.stripeService.handleProcessWebhookDeletedSubscription(event.data);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return response.status(HttpStatus.OK).json({ received: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing webhook:', errorMessage);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }
}
