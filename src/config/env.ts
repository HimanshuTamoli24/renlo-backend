import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" }); // load once here

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const envs= {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(required("PORT")),
  MONGO_URI: required("MONGO_URI"),
};