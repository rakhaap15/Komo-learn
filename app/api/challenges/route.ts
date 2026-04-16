import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";
import { challenges } from "@/db/schema";


type ChallengeInsert = typeof challenges.$inferInsert;
type ChallengeSelect = typeof challenges.$inferSelect;

const safeJson = <T>(data: T) => {
  return NextResponse.json(structuredClone(data));
};

export const GET = async () => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data: ChallengeSelect[] = await db.query.challenges.findMany();

  return safeJson(data);
};

export const POST = async (req: Request) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: ChallengeInsert = await req.json();

  const data = await db
    .insert(challenges)
    .values({
      ...body,
    })
    .returning();

  return safeJson(data[0]);
};