import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";
import { challengeOptions } from "@/db/schema";


type ChallengeOptionInsert = typeof challengeOptions.$inferInsert;
type ChallengeOptionSelect = typeof challengeOptions.$inferSelect;

const safeJson = <T>(data: T) => {
  return NextResponse.json(structuredClone(data));
};

export const GET = async () => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data: ChallengeOptionSelect[] = await db.query.challengeOptions.findMany();

  return safeJson(data);
};

export const POST = async (req: Request) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: ChallengeOptionInsert = await req.json();

  const data = await db
    .insert(challengeOptions)
    .values({
      ...body,
    })
    .returning();

  return safeJson(data[0]);
};