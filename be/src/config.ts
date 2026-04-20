const config = {
  app: {
    port: Number(process.env.PORT || 5000),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "devsamurai-secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_DATABASE || "devsamurai",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
};

export default config;
