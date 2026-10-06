import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.EMAIL_HOST;
const port = host === "smtp.gmail.com" ? 465 : Number(process.env.EMAIL_PORT) || 587;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});