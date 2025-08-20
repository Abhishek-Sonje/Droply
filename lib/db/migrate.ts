import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import path from "path"

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DatabaseURL is not set");
}

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    // console.log("Looking for migrations in:", path.resolve("drizzle"));

    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("All migration are successful!");
  } catch (error) {
    console.log("Migration Failed!", error);
    process.exit(1);
  }
}

runMigration();
