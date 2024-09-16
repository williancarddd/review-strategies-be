import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StudyThemesModule } from './study-themes/study-themes.module';
import { StudyDatesModule } from './study-dates/study-dates.module';
import { PaymentsModule } from './payments/payments.module';
import { VerifyPaymentMiddleware } from './commons/middlewares/check.payment';
import { JwtService } from '@nestjs/jwt';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PrismaModule,
    StudyThemesModule,
    StudyDatesModule,
    PaymentsModule,
    TicketsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {

}