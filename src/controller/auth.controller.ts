import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model";
import {sendResetCodeEmail, sendWelcomeEmail } from "../services/emailService";

const hashCode = (code: string) => crypto.createHash("sha256").update(code).digest("hex");

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
     
    await sendWelcomeEmail(user.email, user.name);
    
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}
  export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required"});
    }
    
    const message = "If that email is registered, a reset code has been sent to your email address.";

const user = await User.findOne({ email });
if (!user) {
  return res.status(200).json({ message });
}

const code = crypto.randomInt(100000, 1000000).toString();
user.resetCode = hashCode(code);
user.resetCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
await user.save();
try {
  await sendResetCodeEmail(email, code);
}catch (error) {
  console.error('Error sending reset code email: \n', error);
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;
  await user.save();
  return res.status(500).json({ message: "Error sending reset code email" });
}
res.status(200).json({ message });

};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Email, code and new password are required" });
  }
  const user = await User.findOne({ 
    email,
    resetCode: hashCode(String(code)),
    resetCodeExpiration: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset code" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });

};