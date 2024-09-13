import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-06-20',
    });
  }

  // Criação de pagamento com Stripe
  async createPayment(userId: string, amount: number, currency: string) {
    // Criar uma sessão de pagamento do Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe usa centavos, por isso multiplicamos por 100
      currency,
      metadata: { userId },
    });

    // Salvar o pagamento no banco de dados
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        paymentType: 'CARD', // Exemplo de tipo de pagamento
        status: 'PENDING',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      payment,
    };
  }

  // Verificar status do pagamento
  async verifyPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });

    if (!payment) {
      throw new BadRequestException('Pagamento não encontrado');
    }

    // Verificar se o pagamento foi confirmado no Stripe
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

    if (paymentIntent.status === 'succeeded') {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });
      return 'Pagamento concluído com sucesso';
    }

    return 'Pagamento ainda pendente ou falhou';
  }
}
