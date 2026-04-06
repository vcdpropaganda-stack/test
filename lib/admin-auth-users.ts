import { Client } from "pg";

export async function getAuthEmailsByIds(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || uniqueUserIds.length === 0) {
    return new Map<string, string>();
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query<{ id: string; email: string | null }>(
      `
        select id::text as id, email
        from auth.users
        where id = any($1::uuid[])
      `,
      [uniqueUserIds]
    );

    return new Map(
      result.rows
        .filter((row) => Boolean(row.email))
        .map((row) => [row.id, row.email as string])
    );
  } catch (error) {
    console.error("getAuthEmailsByIds failed", error);
    return new Map<string, string>();
  } finally {
    await client.end().catch(() => undefined);
  }
}
