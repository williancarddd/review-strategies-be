import { Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { StudyNotificationService } from "./study-notification.service";
import { NotificationService } from "./notifications.service";
import { NotificationController } from "./notifications.controller";

@Global()
@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [MailService, StudyNotificationService, NotificationService],
  exports: [MailService, StudyNotificationService, NotificationService],
})
export class NotificationsModule {}