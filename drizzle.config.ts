import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
      url: process.env.NEXT_DRIZZLE_DATABASE_URL!
  }
});
