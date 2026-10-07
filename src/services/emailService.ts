import dotenv from "dotenv";
import { welcomeEmailTemplate } from "../templates/welcome.template";

dotenv.config();

const sendEmail = async (to: string, subject: string, html: string) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Email is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `E_Commerce App <${from}>`,
      to: [to],
      subject,
      html,
    }),
  });

  const body = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(body?.message || "Resend request failed");
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
