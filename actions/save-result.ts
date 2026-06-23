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
  questions: {
    questionId: number;
    timeSpent: number;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
  }[];
}) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await currentUser();

  const name =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "Anonymous";

  const [testResult] = await db
    .insert(schema.testResults)
    .values({
      userId,
      name,
      score: data.score,
      timeSpent: data.timeSpent,
      correctCount: data.correctCount,
      totalQuestions: data.totalQuestions,
      level: data.level,
      date: new Date().toISOString(),
    })
    .returning({
      id: schema.testResults.id,
    });

  if (data.questions.length > 0) {
    await db.insert(schema.questionResults).values(
      data.questions.map((q) => ({
        testResultId: testResult.id,
        questionId: q.questionId,
        timeSpent: q.timeSpent,
        isCorrect: q.isCorrect,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
      }))
    );
  }
};