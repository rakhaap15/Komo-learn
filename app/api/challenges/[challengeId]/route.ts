import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = Promise<{ challengeId: string }>;

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

  const { challengeId } = await params;

  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, Number(challengeId)),
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

  const { challengeId } = await params;
  const body = await req.json();

  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, Number(challengeId)))
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

  const { challengeId } = await params;

  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, Number(challengeId)))
    .returning();

  return safeJson(data[0]);
};