import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { StripeService } from "./payments.service";
import { PrismaService } from "src/database/prisma/prisma.service";

@ApiTags("Checkout")
@Controller("checkout")
export class StripeCheckoutController {
  constructor(private readonly stripeService: StripeService, private prisma: PrismaService) { }

  @Get("/subscription")
  @ApiOperation({ summary: "Check if user has a subscription" })
  @ApiQuery({ name: "userId", type: "string" })
  async checkSubscription(@Query("userId") userId: string) {
    return await this.stripeService.checkIfUserHasActiveSubscription(userId)
  }

  @Post()
  @ApiOperation({ summary: "Create a checkout session" })
  @ApiBody({ schema: { type: "object", properties: { userId: { type: "string" } } } })

  async createCheckoutSession(@Body() data: { userId: string }, @Req() request, @Res() response) {
    const userId = data.userId;
    if (!userId) {
      return response.status(403).send({
        error: 'Not authorized'
      })
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId as string
      }
    })
    if (!user) {
      return response.status(403).send({
        error: 'Not authorized'
      })
    }
    const session = await this.stripeService.createCheckoutSession(user.email, userId );
    return response.status(200).send(session);
  }

  @Get("/information-user")
  @ApiOperation({ summary: "Get user information" })
  @ApiQuery({ name: "userId", type: "string" })
  async getUserInformation(@Query("userId") userId: string) {
    return  await this.stripeService.billingInformationForUser(userId)
  }

  @Get("/cancel-subscription")
  @ApiOperation({ summary: "Cancel user subscription" })
  @ApiQuery({ name: "userId", type: "string" })
  async cancelSubscription(@Query("userId") userId: string) {
    return await this.stripeService.cancelSubscription(userId)
  }
}