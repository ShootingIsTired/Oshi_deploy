import { NextResponse } from "next/server";

import { initializeDb } from "@/db";
import { usersTable } from "@/db/schema";

export const GET = async () => {
  const db = await initializeDb();
  try {
    const deletedUsers = await db.delete(usersTable).returning();
    console.log("Deleted Users: ", deletedUsers);

    return NextResponse.json(
      { message: "Database cleared successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error clearing the database:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
