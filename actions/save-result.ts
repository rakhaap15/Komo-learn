"use server";

import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";

export const saveResult = async (data: {
    score: number;
    timeSpent: number;
    correctCount: number;
    totalQuestions: number;
    level: string;
}) => {
    const { userId } = await auth(); 

    if (!userId) throw new Error("Unauthorized");

    const user = await currentUser();

    const name =
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        "Anonymous";

    await db.insert(schema.testResults).values({
        userId,
        name,
        score: data.score,
        timeSpent: data.timeSpent,
        correctCount: data.correctCount,
        totalQuestions: data.totalQuestions,
        level: data.level,
    });
};