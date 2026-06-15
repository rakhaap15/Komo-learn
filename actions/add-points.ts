"use server";

import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const addPoints = async (amount: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!Number.isFinite(amount) || amount <= 0) return;

  const current = await getUserProgress();
  if (!current) throw new Error("User progress not found");

  await db
    .update(userProgress)
    .set({ points: current.points + amount })
    .where(eq(userProgress.userId, userId));
};

