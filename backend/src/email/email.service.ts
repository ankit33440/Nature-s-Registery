import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  async sendRegistrationNotification(user: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
  }): Promise<void> {
    const adminEmail = this.configService.get<string>('SUPERADMIN_EMAIL');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const from = this.configService.get<string>('SMTP_FROM', "Nature's Registry <no-reply@naturesregistry.com>");

    const info = await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New registration pending approval — ${user.firstName} ${user.lastName}`,
      text: [
        `A new Project Developer has registered and is awaiting your approval.`,
        ``,
        `Name:       ${user.firstName} ${user.lastName}`,
        `Email:      ${user.email}`,
        `Registered: ${user.createdAt.toISOString()}`,
        ``,
        `Review this user at: ${frontendUrl}/admin/users`,
      ].join('\n'),
    }).catch((err: unknown) => {
      this.logger.warn(`Failed to send registration notification email: ${String(err)}`);
      return null;
    });

    if (info) {
      this.logger.log(`Registration notification sent. Preview: ${nodemailer.getTestMessageUrl(info as nodemailer.SentMessageInfo) || 'n/a'}`);
    }
  }

  async sendInvitation(user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    invitationToken: string;
  }): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const from = this.configService.get<string>('SMTP_FROM', "Nature's Registry <no-reply@naturesregistry.com>");
    const inviteLink = `${frontendUrl}/accept-invitation?token=${user.invitationToken}`;

    const info = await this.transporter.sendMail({
      from,
      to: user.email,
      subject: "You've been invited to Nature's Registry",
      text: [
        `Hello ${user.firstName} ${user.lastName},`,
        ``,
        `You have been invited to join Nature's Registry as a ${user.role.replace(/_/g, ' ')}.`,
        ``,
        `Click the link below to set your password and activate your account:`,
        ``,
        `  ${inviteLink}`,
        ``,
        `This link expires in 48 hours.`,
        ``,
        `If you did not expect this invitation, you can safely ignore this email.`,
        ``,
        `— The Nature's Registry Team`,
      ].join('\n'),
    }).catch((err: unknown) => {
      this.logger.warn(`Failed to send invitation email: ${String(err)}`);
      return null;
    });

    if (info) {
      this.logger.log(`Invitation sent to ${user.email}. Preview: ${nodemailer.getTestMessageUrl(info as nodemailer.SentMessageInfo) || 'n/a'}`);
    }
  }
}
