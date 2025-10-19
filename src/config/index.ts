import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  app: {
    port: Number(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "access",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
};
