import process from "node:process";
import pg from "pg";

const DEMO_EMAILS = [
  "vlservice+admin@gmail.com",
  "vlservice+ana@gmail.com",
  "vlservice+bruno@gmail.com",
  "vlservice+carla@gmail.com",
  "vocedigitalpropaganda@gmail.com",
  "vlservice+cliente1@gmail.com",
  "vlservice+cliente2@gmail.com",
  "vlservice+cliente3@gmail.com",
  "vlservice+cliente4@gmail.com",
];

const DEMO_JOB_SLUGS = [
  "faxina-apartamento-vila-mariana",
  "estrutura-digital-home-office-campinas",
  "maquiagem-e-penteado-evento-corporativo",
  "identidade-visual-clinica-jundiai",
  "organizacao-de-closet-pinheiros",
];

const DEMO_BOOKING_IDS = [
  "10000000-0000-4000-8000-000000000001",
  "10000000-0000-4000-8000-000000000002",
  "10000000-0000-4000-8000-000000000003",
  "10000000-0000-4000-8000-000000000004",
  "10000000-0000-4000-8000-000000000008",
];

const DEMO_CONVERSATION_IDS = [
  "30000000-0000-4000-8000-000000000001",
  "30000000-0000-4000-8000-000000000002",
  "30000000-0000-4000-8000-000000000003",
  "30000000-0000-4000-8000-000000000004",
  "30000000-0000-4000-8000-000000000005",
];

const DEMO_BID_IDS = [
  "21000000-0000-4000-8000-000000000001",
  "21000000-0000-4000-8000-000000000002",
  "21000000-0000-4000-8000-000000000003",
  "21000000-0000-4000-8000-000000000004",
  "21000000-0000-4000-8000-000000000005",
  "21000000-0000-4000-8000-000000000006",
  "21000000-0000-4000-8000-000000000007",
];

function printCheck(ok, label, details) {
  const prefix = ok ? "PASS" : "FAIL";
  console.log(`${prefix} ${label}: ${details}`);
  return ok;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const authUsers = await client.query(
      `
        select email
        from auth.users
        where email = any($1::text[])
        order by email asc
      `,
      [DEMO_EMAILS]
    );

    const jobSummary = await client.query(
      `
        select slug, status
        from public.jobs
        where slug = any($1::text[])
        order by slug asc
      `,
      [DEMO_JOB_SLUGS]
    );

    const bidCount = await client.query(
      `
        select count(*)::int as total
        from public.job_bids
        where id = any($1::uuid[])
      `,
      [DEMO_BID_IDS]
    );

    const conversationCount = await client.query(
      `
        select count(*)::int as total
        from public.conversations
        where id = any($1::uuid[])
      `,
      [DEMO_CONVERSATION_IDS]
    );

    const messageCount = await client.query(
      `
        select count(*)::int as total
        from public.conversation_messages
        where conversation_id = any($1::uuid[])
      `,
      [DEMO_CONVERSATION_IDS]
    );

    const bookingSummary = await client.query(
      `
        select id::text, status
        from public.bookings
        where id = any($1::uuid[])
        order by id asc
      `,
      [DEMO_BOOKING_IDS]
    );

    const reviewCount = await client.query(
      `
        select
          (select count(*)::int from public.reviews where booking_id = any($1::uuid[])) as reviews_total,
          (select count(*)::int from public.client_reviews where booking_id = any($1::uuid[])) as client_reviews_total
      `,
      [DEMO_BOOKING_IDS]
    );

    const creditCount = await client.query(
      `
        select count(*)::int as total
        from public.job_bid_credit_purchases
        where payment_reference like 'demo-pack-%'
      `
    );

    const checks = [
      printCheck(
        authUsers.rowCount === DEMO_EMAILS.length,
        "Demo accounts",
        `${authUsers.rowCount}/${DEMO_EMAILS.length} contas encontradas`
      ),
      printCheck(
        jobSummary.rowCount === DEMO_JOB_SLUGS.length,
        "Demo jobs",
        `${jobSummary.rowCount}/${DEMO_JOB_SLUGS.length} pedidos encontrados`
      ),
      printCheck(
        bidCount.rows[0]?.total === DEMO_BID_IDS.length,
        "Demo bids",
        `${bidCount.rows[0]?.total ?? 0}/${DEMO_BID_IDS.length} propostas encontradas`
      ),
      printCheck(
        conversationCount.rows[0]?.total === DEMO_CONVERSATION_IDS.length,
        "Demo conversations",
        `${conversationCount.rows[0]?.total ?? 0}/${DEMO_CONVERSATION_IDS.length} conversas encontradas`
      ),
      printCheck(
        Number(messageCount.rows[0]?.total ?? 0) >= 20,
        "Demo chat history",
        `${messageCount.rows[0]?.total ?? 0} mensagens seedadas`
      ),
      printCheck(
        bookingSummary.rowCount === DEMO_BOOKING_IDS.length,
        "Demo bookings",
        `${bookingSummary.rowCount}/${DEMO_BOOKING_IDS.length} agendamentos encontrados`
      ),
      printCheck(
        Number(reviewCount.rows[0]?.reviews_total ?? 0) >= 2 &&
          Number(reviewCount.rows[0]?.client_reviews_total ?? 0) >= 2,
        "Demo reviews",
        `cliente=${reviewCount.rows[0]?.client_reviews_total ?? 0}, prestador=${reviewCount.rows[0]?.reviews_total ?? 0}`
      ),
      printCheck(
        Number(creditCount.rows[0]?.total ?? 0) >= 4,
        "Demo credits",
        `${creditCount.rows[0]?.total ?? 0} pacotes demo encontrados`
      ),
    ];

    console.log("\nDemo jobs status:");
    for (const row of jobSummary.rows) {
      console.log(`- ${row.slug}: ${row.status}`);
    }

    console.log("\nDemo bookings status:");
    for (const row of bookingSummary.rows) {
      console.log(`- ${row.id}: ${row.status}`);
    }

    if (checks.every(Boolean)) {
      console.log("\nDemo verification completed successfully.");
      return;
    }

    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
