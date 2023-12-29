import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { privateEnv } from "@/lib/env/private";
import * as schema from "./schema";

async function initializeDb() {
    const client = new Client({
        connectionString: privateEnv.POSTGRES_URL,
        connectionTimeoutMillis: 1000000,
    });

    await client.connect();

    const db = drizzle(client, { schema });
    return db;
}

export { initializeDb };
