import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

type AuthTokenPayload = {
  sub?: string;
  email?: string;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(
      token,
      config.auth.jwtSecret,
    ) as AuthTokenPayload;
    const userId = Number(decoded.sub);

    if (!decoded.sub || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    res.locals.authUser = {
      id: userId,
      email: decoded.email || null,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
