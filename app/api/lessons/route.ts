import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";
import { lessons } from "@/db/schema";


type LessonInsert = typeof lessons.$inferInsert;
type LessonSelect = typeof lessons.$inferSelect;

const safeJson = <T>(data: T) => {
  return NextResponse.json(structuredClone(data));
};

export const GET = async () => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data: LessonSelect[] = await db.query.lessons.findMany();

  return safeJson(data);
};

export const POST = async (req: Request) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: LessonInsert = await req.json();

  const data = await db
    .insert(lessons)
    .values({
      ...body,
    })
    .returning();

  return safeJson(data[0]);
};