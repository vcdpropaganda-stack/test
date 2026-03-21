import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.resolve(__dirname, "../supabase/demo-seed.sql");

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const sql = await fs.readFile(sqlPath, "utf8");
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(sql);

  const summary = await client.query(`
    select 'profiles' as label, count(*)::int as total from public.profiles
    union all
    select 'provider_profiles', count(*)::int from public.provider_profiles
    union all
    select 'services', count(*)::int from public.services
    union all
    select 'service_availability', count(*)::int from public.service_availability
    union all
    select 'bookings', count(*)::int from public.bookings
    union all
    select 'reviews', count(*)::int from public.reviews
    union all
    select 'service_categories', count(*)::int from public.service_categories
    order by label
  `);

  console.log("Demo seed applied successfully.");
  for (const row of summary.rows) {
    console.log(`${row.label}: ${row.total}`);
  }

  console.log("\nDemo credentials:");
  console.log("Password for all demo users: Vitrine123!");
  console.log("vitrinelojas+admin@gmail.com");
  console.log("vitrinelojas+ana@gmail.com");
  console.log("vitrinelojas+bruno@gmail.com");
  console.log("vitrinelojas+carla@gmail.com");
  console.log("vitrinelojas+cliente1@gmail.com");
  console.log("vitrinelojas+cliente2@gmail.com");
  console.log("vitrinelojas+cliente3@gmail.com");
  console.log("vitrinelojas+cliente4@gmail.com");

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
