import { transporter } from "../config/mail";
import { welcomeEmailTemplate } from "../templates/welcome.template";

const sendEmail = async (to: string, subject: string, html: string) => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error("Email is not configured");
  }

  await transporter.sendMail({
    from: `"E_Commerce App" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}

export const sendResetCodeEmail = async (to: string, code: string) => {
  const subject = "Password Reset Code";
  const html = `
    <p>Hello,</p>
    <p>You have requested to reset your password. Please use the following code to reset your password:</p>
    <p><strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    `
    await sendEmail(to, subject, html);
}

export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Welcome to E_Commerce App !!";
  const html = welcomeEmailTemplate(name);
  await sendEmail(to, subject, html);
}
