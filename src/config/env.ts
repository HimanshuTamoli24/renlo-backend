import dotenv from 'dotenv';

import path from 'path';
import fs from 'fs';

// 1. Load default .env if it exists
dotenv.config();

// 2. Load environment-specific .env if it exists
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.dev';
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true });
}

/**
 * Validates that an environment variable exists.
 * If missing, throws a descriptive error helpful for both local and cloud environments.
 */
const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `\n\n❌ Missing required environment variable: ${key}\n` +
        `💡 Local: Check if ${key} is defined in .env, .env.dev, or .env.production\n` +
        `💡 Cloud (Render/Vercel): Add ${key} to the "Environment Variables" section in your dashboard.\n`,
    );
  }
  return value;
};

export const envs = {
  NODE_ENV: nodeEnv.toLowerCase(),
  PORT: Number(process.env.PORT || 7000), // Default to 7000 if not specified
  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN'),
  FRONTEND_URL: required('FRONTEND_URL'),
};
