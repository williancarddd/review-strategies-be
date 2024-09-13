import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorators';

@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  @Post()
  @Public()
  create(@Body('amount') amount: number, @Body('currency') currency: string, @Req() req: any) {
    const userId = req.user.id;
    return this.paymentsService.createPayment(userId, amount, currency);
  }

  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: 200, description: 'Payment verified.' })
  @Get(':paymentId')
  @Public()
  verifyPayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.verifyPayment(paymentId);
  }
}
