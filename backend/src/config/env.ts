import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),

  ACCESS_TOKEN_EXPIRY: z.string().min(1).default("5m"),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),

  REFRESH_TOKEN_EXPIRY: z.string().min(1).default("7d"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment configuration:");

  console.error(z.treeifyError(parsedEnv.error));

  process.exit(1);
}

export const env = parsedEnv.data;
