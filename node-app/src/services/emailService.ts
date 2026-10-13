import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import { welcomeEmailTemplate } from "../templates/welcome.template";

dotenv.config();

const sendEmail = async (to: string, subject: string, html: string) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Email is not configured");
  }

  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      to,
      from: { email: from, name: "E_Commerce App" },
      subject,
      html,
    });
  } catch (error) {
    const response = (error as { response?: { body?: { errors?: { message?: string }[] } } }).response;
    throw new Error(response?.body?.errors?.[0]?.message || "SendGrid request failed");
  }
};

export const sendResetCodeEmail = async (to: string, code: string) => {
  const subject = "Password Reset Code";
  const html = `
    <p>Hello,</p>
    <p>You have requested to reset your password. Please use the following code to reset your password:</p>
    <p><strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    `;
  await sendEmail(to, subject, html);
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = "Welcome to E_Commerce App !!";
  const html = welcomeEmailTemplate(name);
  await sendEmail(to, subject, html);
};
