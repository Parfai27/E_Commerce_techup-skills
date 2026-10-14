import { Router } from "express";
import { register, login, forgotPassword, resetPassword, createSeller, listSellers, deleteSeller } from "../controller/auth.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/sellers", authenticate, authorize("admin"), listSellers);
authRouter.post("/sellers", authenticate, authorize("admin"), createSeller);
authRouter.delete("/sellers/:id", authenticate, authorize("admin"), deleteSeller);

export default authRouter;
