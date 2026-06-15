import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  context: { params: Promise<{ challengeOptionId: string }> },
) => {
  const { challengeOptionId } = await context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const id = Number(challengeOptionId);
  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, id),
  });


  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  context: { params: Promise<{ challengeOptionId: string }> },
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeOptionId } = await context.params;
  const id = Number(challengeOptionId);
  const body = await req.json();
  const data = await db.update(challengeOptions).set({
    ...body,
  }).where(eq(challengeOptions.id, id)).returning();


  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ challengeOptionId: string }> },
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeOptionId } = await context.params;
  const id = Number(challengeOptionId);
  const data = await db.delete(challengeOptions)
    .where(eq(challengeOptions.id, id)).returning();


  return NextResponse.json(data[0]);
};
