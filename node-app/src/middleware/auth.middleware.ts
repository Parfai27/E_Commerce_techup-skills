import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AppRole = "admin" | "seller" | "user";

export interface AuthUser {
  userId: string;
  role: AppRole;
}

const asRole = (value: unknown): AppRole => {
  if (value === "admin" || value === "seller") return value;
  return "user";
};

export const getAuth = (req: Request): AuthUser => {
  const user = (req as Request & { user?: { userId?: string; role?: unknown } }).user;
  return {
    userId: user?.userId ?? "",
    role: asRole(user?.role),
  };
};

export const authorize =
  (...roles: AppRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = getAuth(req);

    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "You do not have access to this action",
      });
    }

    next();
  };

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid authentication format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId?: string;
      role?: unknown;
    };

    (req as Request & { user: AuthUser }).user = {
      userId: decoded.userId ?? "",
      role: asRole(decoded.role),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
