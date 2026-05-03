"use server";

import db from "@/db/drizzle";
import { challengeProgress, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { fuzzyDecision } from "@/lib/fuzzy";

export const finishLevel = async () => {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    // =========================
    // 1. AMBIL 25 SOAL TERAKHIR
    // =========================
    const progress = await db.query.challengeProgress.findMany({
        where: eq(challengeProgress.userId, userId),
        orderBy: desc(challengeProgress.createdAt),
        limit: 25,
    });

    if (progress.length < 25) {
        throw new Error("Belum menyelesaikan 25 soal");
    }

    // =========================
    // 2. HITUNG NILAI
    // =========================
    const totalCorrect = progress.filter(p => p.isCorrect).length;
    const score = (totalCorrect / 25) * 100;

    // =========================
    // 3. HITUNG TOTAL WAKTU
    // =========================
    const totalTime = progress.reduce((acc, p) => {
        return acc + (p.timeSpent ?? 0);
    }, 0);

    const timeInMinutes = totalTime / 60;

    // =========================
    // 4. FUZZY MAMDANI
    // =========================
    const fuzzyResult = fuzzyDecision(score, timeInMinutes);

    // =========================
    // DEBUG (buat demo & cek)
    // =========================
    console.log("=== HASIL FUZZY ===");
    console.log({
        score,
        totalCorrect,
        totalTime,
        timeInMinutes,
        fuzzyResult,
    });

    // =========================
    // 5. UPDATE USER
    // =========================
    const currentUser = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
    });

    if (!currentUser) throw new Error("User not found");

    let newPoints = currentUser.points + Math.round(fuzzyResult.crisp * 5); // 0-500 points from fuzzy

    // 🔥 ANTI NEGATIF
    newPoints = Math.max(0, newPoints);

    await db.update(userProgress)
        .set({
            points: newPoints,
        })
        .where(eq(userProgress.userId, userId));

    // =========================
    // RESPONSE
    // =========================
    return {
        score,
        totalCorrect,
        totalTime,
        timeInMinutes,
        ...fuzzyResult,
        newPoints,
    };
};