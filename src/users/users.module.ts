import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordRecoveryService } from './password-recovery.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordRecoveryService],
})
export class UsersModule {}
