import { defineConfig } from 'drizzle-kit'
import { env } from "@/env";


export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["rankit_*"],
});