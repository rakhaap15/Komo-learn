import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = Promise<{ challengeOptionId: string }>;

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

  const { challengeOptionId } = await params;

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, Number(challengeOptionId)),
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

  const { challengeOptionId } = await params;
  const body = await req.json();

  const data = await db
    .update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, Number(challengeOptionId)))
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

  const { challengeOptionId } = await params;

  const data = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, Number(challengeOptionId)))
    .returning();

  return safeJson(data[0]);
};