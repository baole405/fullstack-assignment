import { Router } from "express";
import { signup, login, me } from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);

export default authRouter;
