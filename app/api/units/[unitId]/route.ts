import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = Promise<{ unitId: string }>;

const safeJson = <T>(data: T) => {
  return NextResponse.json(structuredClone(data));
};

export const GET = async (
  req: Request,
  { params }: { params: Params }
) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;

  const data = await db.query.units.findFirst({
    where: eq(units.id, Number(unitId)),
  });

  return safeJson(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: Params }
) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;
  const body = await req.json();

  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, Number(unitId)))
    .returning();

  return safeJson(data[0]);
};

export const DELETE = async (
  req: Request,
  { params }: { params: Params }
) => {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;

  const data = await db
    .delete(units)
    .where(eq(units.id, Number(unitId)))
    .returning();

  return safeJson(data[0]);
};