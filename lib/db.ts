import { Pool } from "pg";
import { getSupabaseEnv } from "@/lib/env";

declare global {
  var __vlservicePool: InstanceType<typeof Pool> | undefined;
}

export function getDbPool() {
  const { databaseUrl } = getSupabaseEnv();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__vlservicePool) {
    global.__vlservicePool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 4,
    });
  }

  return global.__vlservicePool;
}
