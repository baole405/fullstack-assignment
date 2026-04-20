import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import config from "../../config";
import repository from "../../data/repos";

type UserRecord = {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
};

type UserPublic = {
  id: number;
  name: string | null;
  email: string;
};

type AuthTokenPayload = {
  sub?: string;
  email?: string;
};

type SignupInput = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginInput = {
  email?: string;
  password?: string;
};

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sanitizeEmail = (email?: string): string =>
  (email || "").trim().toLowerCase();

const signAccessToken = (user: UserPublic): string => {
  const expiresIn = config.auth.jwtExpiresIn as jwt.SignOptions["expiresIn"];

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
    },
    config.auth.jwtSecret,
    {
      expiresIn,
    },
  );
};

const signRefreshToken = (user: UserPublic): string => {
  const expiresIn = config.auth
    .jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"];

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
    },
    config.auth.jwtSecret,
    {
      expiresIn,
    },
  );
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new HttpError(400, "refreshToken is required");
  }

  let decoded: AuthTokenPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      config.auth.jwtSecret,
    ) as AuthTokenPayload;
  } catch (_error) {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  const userId = Number(decoded.sub);

  if (!decoded.sub || Number.isNaN(userId)) {
    throw new HttpError(401, "Invalid refresh token payload");
  }

  const user = await repository.sequelizeClient.query<UserPublic>(
    `
      SELECT id, name, email
      FROM users
      WHERE id = :id
      LIMIT 1
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { id: userId },
      plain: true,
    },
  );

  if (!user) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const accessToken = signAccessToken(user);
  const newRefreshToken = signRefreshToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const signupUser = async (input: SignupInput) => {
  const email = sanitizeEmail(input.email);
  const name = input.name?.trim() || null;
  const password = (input.password || "").trim();

  if (!email || !password) {
    throw new HttpError(400, "email and password are required");
  }

  if (password.length < 6) {
    throw new HttpError(400, "password must be at least 6 characters");
  }

  const existingUser = await repository.sequelizeClient.query<{ id: number }>(
    `SELECT id FROM users WHERE email = :email LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      replacements: { email },
      plain: true,
    },
  );

  if (existingUser) {
    throw new HttpError(409, "email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const createdUsers = await repository.sequelizeClient.query<UserPublic>(
    `
			INSERT INTO users (name, email, "passwordHash")
			VALUES (:name, :email, :passwordHash)
			RETURNING id, name, email
		`,
    {
      type: QueryTypes.SELECT,
      replacements: { name, email, passwordHash },
    },
  );

  const user = createdUsers[0];

  if (!user) {
    throw new HttpError(500, "failed to create user");
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const loginUser = async (input: LoginInput) => {
  const email = sanitizeEmail(input.email);
  const password = (input.password || "").trim();

  if (!email || !password) {
    throw new HttpError(400, "email and password are required");
  }

  const user = await repository.sequelizeClient.query<UserRecord>(
    `
			SELECT id, name, email, "passwordHash"
			FROM users
			WHERE email = :email
			LIMIT 1
		`,
    {
      type: QueryTypes.SELECT,
      replacements: { email },
      plain: true,
    },
  );

  if (!user) {
    throw new HttpError(401, "invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "invalid email or password");
  }

  const publicUser: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = signAccessToken(publicUser);
  const refreshToken = signRefreshToken(publicUser);

  return {
    user: publicUser,
    accessToken,
    refreshToken,
  };
};
