import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
import { createTransport, Transporter } from 'nodemailer';
import { defaultConfig } from '../../../config/default.config';

@Injectable()
export class MailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: defaultConfig.nodemailer_host,
      port: defaultConfig.nodemailer_port,
      secure: true,
      auth: {
        user: defaultConfig.nodemailer_auth_user,
        pass: defaultConfig.nodemailer_auth_pass,
      },
      defaults: {
        from: `"轩辕天书" <${defaultConfig.nodemailer_auth_user}>`,
      },
    });
  }

  /**
   * 邮件发送
   */
  public async sendMail(
    toer: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<any> {
    return await this.transporter.sendMail({
      to: toer,
      // from: defaultConfig.nodemailer_auth_user'),
      from: `"轩辕天书" <${defaultConfig.nodemailer_auth_user}>`,
      subject: subject,
      text: text,
      html: html,
    });
  }
}
