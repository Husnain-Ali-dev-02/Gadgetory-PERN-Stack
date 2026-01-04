import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  /**
   * BASE_URL should be the public base URL for the API (including protocol and host),
   * e.g. https://api.example.com. When set, it will be used for building public
   * asset URLs (uploads). If not set, the server falls back to request-derived values.
   */
  BASE_URL: process.env.BASE_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};