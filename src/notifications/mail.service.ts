import { Injectable } from "@nestjs/common";
import { CreateBatchOptions, Resend } from 'resend';
import { CreateTicketDto } from "src/tickets/dto/create-ticket.dto";
import { recoveryPasswordTemplate } from "./mail/template/recovery-password";
import { studyReminderTemplate } from "./mail/template/remember-study";

@Injectable()
export class MailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(process.env.RESEND_KEY);
  }

  async newTicket(ticket: CreateTicketDto) {
    await this.resend.emails.send({
      from: 'William  <support-ticket-review@resend.dev>',
      to: "williancard123@gmail.com",
      subject: `Review Ticket ${ticket.type}`,
      html: `
      ${ticket.description}
      ${ticket.type}
      email: ${ticket.email}
      `,
    });
  }

  async recoverPassword({ email, token }: { email: string; token: string }) {
    await this.resend.emails.send({
      from: 'William  <recovery-review@resend.dev>',
      to: email,
      subject: `Recuperação de Senha`,
      html: recoveryPasswordTemplate({ name: email, token }),
    });
  }

  async studyReminder(students: { discipline: string; hour: Date; studentName: string; email: string }[]) {
    // Dividir os emails em lotes de até 100 emails
    const batchSize = 100;
    const batches: CreateBatchOptions[] = [];

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize).map(student => ({
        from: 'Herman.ai <remember-study@resend.dev>',
        to: [student.email], // Coloca cada destinatário em uma lista
        subject: `Lembrete de Estudo - ${student.discipline}`,
        html: studyReminderTemplate({
          discipline: student.discipline,
          hour: student.hour,
          studentName: student.studentName,
        }),
      }));

      batches.push(batch);
    }

    // Enviar cada lote com o endpoint batch
    for (const batch of batches) {
      await this.resend.batch.send(batch);
    }
  }
}
