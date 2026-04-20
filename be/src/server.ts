import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.routes";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cors())
    .use(express.json())
    .use(express.urlencoded());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRouter);

  return app;
};
