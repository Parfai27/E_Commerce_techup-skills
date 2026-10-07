import dotenv from "dotenv";
import { welcomeEmailTemplate } from "../templates/welcome.template";

dotenv.config();

const sendEmail = async (to: string, subject: string, html: string) => {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !secretKey || !from) {
    throw new Error("Email is not configured");
  }

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: from, Name: "E_Commerce App" },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  });

  const body = (await response.json().catch(() => null)) as {
    ErrorMessage?: string;
    Messages?: { Status?: string; Errors?: { ErrorMessage?: string }[] }[];
  } | null;

  const mailjetMessage = body?.Messages?.[0]?.Errors?.[0]?.ErrorMessage || body?.ErrorMessage;

  if (!response.ok || body?.Messages?.[0]?.Status === "error") {
    throw new Error(mailjetMessage || "Mailjet request failed");
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
