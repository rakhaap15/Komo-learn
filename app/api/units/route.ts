import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";
import { units } from "@/db/schema";


type UnitInsert = typeof units.$inferInsert;
type UnitSelect = typeof units.$inferSelect;

const safeJson = <T>(data: T) => {
  return NextResponse.json(structuredClone(data));
};

export const GET = async () => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data: UnitSelect[] = await db.query.units.findMany();

  return safeJson(data);
};

export const POST = async (req: Request) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body: UnitInsert = await req.json();

  const data = await db
    .insert(units)
    .values({
      ...body,
    })
    .returning();

  return safeJson(data[0]);
};