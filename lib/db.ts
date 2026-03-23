import { Pool } from "pg";
import { getSupabaseEnv } from "@/lib/env";

declare global {
  var __vitrinePool: InstanceType<typeof Pool> | undefined;
}

export function getDbPool() {
  const { databaseUrl } = getSupabaseEnv();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__vitrinePool) {
    global.__vitrinePool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 4,
    });
  }

  return global.__vitrinePool;
}
