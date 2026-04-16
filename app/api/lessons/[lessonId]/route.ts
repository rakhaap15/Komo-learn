import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = Promise<{ lessonId: string }>;

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

  const { lessonId } = await params;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, Number(lessonId)),
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

  const { lessonId } = await params;
  const body = await req.json();

  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, Number(lessonId)))
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

  const { lessonId } = await params;

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, Number(lessonId)))
    .returning();

  return safeJson(data[0]);
};