import { Injectable } from "@nestjs/common";
import { Resend } from 'resend';
import { CreateTicketDto } from "src/tickets/dto/create-ticket.dto";


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
}