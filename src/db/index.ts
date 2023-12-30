// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
// import { privateEnv } from "@/lib/env/private";
// import * as schema from "./schema";
//
// async function initializeDb() {
//   const client = new Client({
//     connectionString: privateEnv.POSTGRES_URL,
//     connectionTimeoutMillis: 1000000,
//   });

//   try {
//     await client.connect();
//     const db = drizzle(client, { schema });
//     return db;
//   } catch (error) {
//     console.error("Failed to connect to the database:", error);
//     // Additional error handling logic goes here
//     throw error; // Rethrow the error if you want to handle it further up the call stack
//   }
// }

// export { initializeDb };

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg"; // Import Pool instead of Client
import { privateEnv } from "@/lib/env/private";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: privateEnv.POSTGRES_URL,
  max: 300, // Adjust the maximum number of connections
  idleTimeoutMillis: 300000,
});

async function initializeDb() {
  const client = await pool.connect(); // Get a client from the pool
  try {
    const db = drizzle(client, { schema });
    return db;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

export { initializeDb, pool };