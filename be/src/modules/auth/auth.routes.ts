import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { login, me, refresh, signup } from "./auth.controller";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.get("/me", requireAuth, me);

export default authRouter;
