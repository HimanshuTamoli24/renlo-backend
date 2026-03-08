import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: envFile });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const envs = {
  NODE_ENV: (process.env.NODE_ENV ?? 'development').toLowerCase(),
  PORT: Number(required('PORT')),
  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN'),
  FRONTEND_URL: required('FRONTEND_URL'),
};
