import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/setting/setting";
let transporter = nodemailer.createTransport({
  //service: 'gmail',
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: SETTINGS.EMAIL,
    pass: SETTINGS.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<void> {
    await transporter.sendMail({
      from: `"Blogs platform" <${SETTINGS.EMAIL}>`,
      to: email,
      subject: `Email Confirmation`,
      html: template(code),
    });
  },
};
