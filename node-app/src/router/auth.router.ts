import { Router } from "express";
import { register, login, forgotPassword, resetPassword, createSeller } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/sellers", authenticate, authorize("admin"), createSeller);

export default authRouter;
