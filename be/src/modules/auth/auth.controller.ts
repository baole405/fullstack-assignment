import { Request, Response } from "express";
import {
  HttpError,
  loginUser,
  refreshAccessToken,
  signupUser,
} from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "internal server error" });
  }
};

export const me = async (_req: Request, res: Response) => {
  return res.status(200).json({ user: res.locals.authUser });
};
