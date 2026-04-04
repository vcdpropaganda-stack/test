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
    select 'client_reviews', count(*)::int from public.client_reviews
    union all
    select 'jobs', count(*)::int from public.jobs
    union all
    select 'job_bids', count(*)::int from public.job_bids
    union all
    select 'job_bid_credit_purchases', count(*)::int from public.job_bid_credit_purchases
    union all
    select 'conversations', count(*)::int from public.conversations
    union all
    select 'conversation_messages', count(*)::int from public.conversation_messages
    union all
    select 'service_categories', count(*)::int from public.service_categories
    order by label
  `);

  console.log("Demo seed applied successfully.");
  for (const row of summary.rows) {
    console.log(`${row.label}: ${row.total}`);
  }

  console.log("\nDemo credentials:");
  console.log("Password for all demo users: VLservice123!");
  console.log("vlservice+admin@gmail.com");
  console.log("vlservice+ana@gmail.com");
  console.log("vlservice+bruno@gmail.com");
  console.log("vlservice+carla@gmail.com");
  console.log("vlservice+cliente1@gmail.com");
  console.log("vlservice+cliente2@gmail.com");
  console.log("vlservice+cliente3@gmail.com");
  console.log("vlservice+cliente4@gmail.com");
  console.log("\nDemo docs:");
  console.log("docs/demo-accounts-and-access.md");
  console.log("docs/demo-presentation-script.md");
  console.log("docs/demo-qa-checklist.md");

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
