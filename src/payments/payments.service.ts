// stripe.service.ts
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/database/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });
  }


  async getStripeCustomerByEmail(email: string): Promise<Stripe.Customer> {
    const customers = await this.stripe.customers.list({ email });
    return customers.data[0];
  }

  async createStripeCustomer(email: string, name: string): Promise<Stripe.Customer> {
    const customer = await this.getStripeCustomerByEmail(email);
    if (customer) {
      return customer;
    }

    return await this.stripe.customers.create({
      email,
      name,
    });
  }

  async createCheckoutSession(userEmail: string, userId: string): Promise<{ url: string }> {
    try {
      let customer = await this.createStripeCustomer(userEmail, userId);
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        client_reference_id: userId,
        customer: customer.id,
        success_url: `https://www.reviewstrategies.com.br/billing/success`,
        cancel_url: `https://www.reviewstrategies.com.br/billing/cancel`,
        line_items: [{
          price: process.env.proPriceId,
          quantity: 1,
        }],
      });
      return { url: session.url! };
    } catch (error) {
      console.error("createCheckoutSession error", error);
      throw new BadGatewayException("Error creating checkout session");
    }
  }


  async handleProcessWebhookCheckout(event: { object: Stripe.Checkout.Session }) {
    const clientReferenceId = event.object.client_reference_id as string
    const stripeSubscriptionId = event.object.subscription as string
    const stripeCustomerId = event.object.customer as string
    const checkoutStatus = event.object.status

    console.log(JSON.stringify(event))
    if (checkoutStatus !== 'complete') return

    if (!clientReferenceId || !stripeSubscriptionId || !stripeCustomerId) {
      throw new Error('clientReferenceId, stripeSubscriptionId and stripeCustomerId is required')
    }

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: clientReferenceId
      },
      select: {
        id: true
      }
    })

    if (!userExists) {
      throw new Error('user of clientReferenceId not found')
    }

    await this.prisma.user.update({
      where: {
        id: userExists.id
      },
      data: {
        stripeCustomerId,
        stripeSubscriptionId
      }
    })
  }

  async handleProcessWebhookUpdatedSubscription(event: { object: Stripe.Subscription }) {
    const stripeCustomerId = event.object.customer as string
    const stripeSubscriptionId = event.object.id as string
    const stripeSubscriptionStatus = event.object.status

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            stripeSubscriptionId,
          },
          {
            stripeCustomerId
          }
        ]
      },
      select: {
        id: true
      }
    })

    if (!userExists) {
      throw new Error('user of stripeCustomerId not found')
    }

    await this.prisma.user.update({
      where: {
        id: userExists.id
      },
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        stripeSubscriptionStatus,
      }
    })
  }

  async handleProcessWebhookDeletedSubscription(event: { object: Stripe.Subscription }) {
    const stripeSubscriptionId = event.object.id as string

    const userExists = await this.prisma.user.findFirst({
      where: {
        stripeSubscriptionId
      },
      select: {
        id: true
      }
    })

    if (!userExists) {
      throw new Error('user of stripeSubscriptionId not found')
    }

    await this.prisma.user.update({
      where: {
        id: userExists.id
      },
      data: {
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: null
      }
    })
  }

  async checkIfUserHasActiveSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        stripeSubscriptionId: true,
        stripeCustomerId: true
      }
    })

    if (!user) {
      throw new  NotFoundException('User not found')
    }

    if (!user.stripeSubscriptionId || !user.stripeCustomerId) {
      return {
        hasActiveSubscription: false
      }
    }

    const stripeStatus = (await this.stripe.subscriptions.retrieve(user.stripeSubscriptionId!))
    console.log(stripeStatus)
    return {
      hasActiveSubscription: stripeStatus.status === 'active' || stripeStatus.status === 'trialing'
    }
  }

  async billingInformationForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeSubscriptionStatus: true
      }
    })

    if (!user) {
      throw new  NotFoundException('User not found')
    }

    if (!user.stripeCustomerId || !user.stripeSubscriptionId) {
      return {
        stripeCustomer: null,
        stripeSubscription: null,
        stripePaymentMethods: null,
        invoices: null
      }
    }

    const stripeCustomer = await this.stripe.customers.retrieve(user.stripeCustomerId!)
    const stripeSubscription = await this.stripe.subscriptions.retrieve(user.stripeSubscriptionId!)
    const stripePaymentMethods = await this.stripe.paymentMethods.list({
      customer: user.stripeCustomerId!,
    })
    const invoices = await this.stripe.invoices.list({
      customer: user.stripeCustomerId!,
      limit: 10
    })
    return {
      stripeCustomer,
      stripeSubscription,
      stripePaymentMethods,
      invoices
    }
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        stripeSubscriptionId: true
      }
    })

    if (!user) {
      throw new  NotFoundException('User not found')
    }

    await this.stripe.subscriptions.cancel(user.stripeSubscriptionId!)
    return {
      message: 'Subscription canceled'
    }
  }
}
