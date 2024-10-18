import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MailService } from 'src/notifications/mail.service';
import { encryptPassword } from 'src/utils/crypto';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) { }

  async requestPasswordRecovery(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Gerar código de recuperação de 5 dígitos
    const recoveryPasswordCode = Math.floor(10000 + Math.random() * 90000).toString();

    // Expiração do código em 30 minutos
    const expiresCodePasswordAt = new Date();
    expiresCodePasswordAt.setMinutes(expiresCodePasswordAt.getMinutes() + 30);

    // Armazenar no banco de dados
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryPasswordCode,
        expiresCodePasswordAt,
      },
    });

    // Enviar email de recuperação
    await this.mailService.recoverPassword({
      email,
      token: recoveryPasswordCode,
    });

    return { message: 'Recovery code sent to email' };
  }

  async verifyRecoveryCode(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const recovery = await this.prisma.user.findFirst({
      where: {
        id: user.id,
        recoveryPasswordCode: code,
        expiresCodePasswordAt: {
          gt: new Date(),
        },
      },
    });



    if (!recovery) {
      throw new BadRequestException('Invalid or expired recovery code');
    }


    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: encryptPassword(newPassword),
        recoveryPasswordCode: null,
        expiresCodePasswordAt: null,
      },
    });

    return { message: 'Recovery code is valid' };
  }
}
