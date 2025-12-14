import { Logger } from "@nestjs/common";
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}`, override: true, quiet: true });

export enum NODE_ENVS {
  TEST = "test",
  LOCAL = "local",
  DEV = "dev",
  STAGE = "stage",
  PRODUCTION = "production",
}

export const getEnvVariable = <T extends string | number>(
  key: keyof IEnvVariables,
  defaultValue?: T,
): T => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    Logger.warn(`Required environment variable ${key} is missing`);
  }

  if (typeof defaultValue === "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return defaultValue as T;
    }
    return numValue as T;
  }
  return (value || defaultValue) as T;
};

export const envConfig: IEnvVariables = {
  APP_NAME: getEnvVariable<string>(
    "APP_NAME",
    "Government Complaints Platform",
  ),
  MEDIA_PATH: getEnvVariable<string>("MEDIA_PATH", "/static-files"),
  JWT_SECRET: getEnvVariable<string>(
    "JWT_SECRET",
    "DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.",
  ),
  ACCESS_TOKEN_EXPIRE_IN: getEnvVariable<string>(
    "ACCESS_TOKEN_EXPIRE_IN",
    "2D",
  ),
  FIREBASE_PROJECT_ID: getEnvVariable<string>("FIREBASE_PROJECT_ID", ""),
  FIREBASE_CLIENT_EMAIL: getEnvVariable<string>("FIREBASE_CLIENT_EMAIL", ""),
  FIREBASE_PRIVATE_KEY: getEnvVariable<string>("FIREBASE_PRIVATE_KEY", ""),
  OTP_MASTER_CODE: getEnvVariable<string>("OTP_MASTER_CODE", "0000"),
  SWAGGER_USERNAME: getEnvVariable<string>("SWAGGER_USERNAME", "admin"),
  SWAGGER_PASSWORD: getEnvVariable<string>("SWAGGER_PASSWORD", "admin"),
  BASE_URL: getEnvVariable<string>("BASE_URL", "http://localhost:3000"),
  DEFAULT_SALT_HASH_ITERATIONS: getEnvVariable<number>(
    "DEFAULT_SALT_HASH_ITERATIONS",
    10,
  ),
  PORT: getEnvVariable<number>("PORT", 3000),
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  CURRENT_ENV: process.env.NODE_ENV as NODE_ENVS,

  IS_DEV_ENV: () => {
    if (process.env.NODE_ENV === NODE_ENVS.DEV) {
      return true;
    }
    return false;
  },
  IS_PRODUCTION_ENV: () => {
    if (process.env.NODE_ENV === NODE_ENVS.PRODUCTION) {
      return true;
    }
    return false;
  },
};

interface IEnvVariables {
  ACCESS_TOKEN_EXPIRE_IN: string;
  APP_NAME: string;
  MEDIA_PATH: string;
  SWAGGER_USERNAME: string;
  SWAGGER_PASSWORD: string;
  JWT_SECRET: string;
  BASE_URL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  DATABASE_URL: string;
  CURRENT_ENV: NODE_ENVS;
  PORT: number;
  DEFAULT_SALT_HASH_ITERATIONS: number;
  OTP_MASTER_CODE: string;
  IS_DEV_ENV: () => boolean;
  IS_PRODUCTION_ENV: () => boolean;
}
