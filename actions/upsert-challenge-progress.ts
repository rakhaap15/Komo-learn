"use server";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (
    challengeId: number,
    isCorrect: boolean,
    timeSpent: number
) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // VALIDASI WAKTU 🔥
  
    if (timeSpent < 0) timeSpent = 0;

    // max 60 detik per soal (1 soal = 1 menit)
    timeSpent = Math.min(timeSpent, 60);

   
    // GET USER DATA
    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();
    
    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    // GET CHALLENGE
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    });

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonsId;

    // CEK PROGRESS EXISTING
    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgress;


    // CEK HEARTS
    if (
        currentUserProgress.hearts === 0 && 
        !isPractice && 
        !userSubscription?.isActive
    ) {
        return { error: "hearts" };
    }


    // DEBUG LOG (OPSIONAL)
    console.log({
        challengeId,
        isCorrect,
        timeSpent,
    });

    // PRACTICE MODE (UPDATE)
    if (isPractice) {
        await db.update(challengeProgress).set({
            completed: true,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            // createdAt tidak perlu di-set (sudah default di DB)
        })
        .where(
            eq(challengeProgress.id, existingChallengeProgress.id)
        );

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 2),
        }).where(eq(userProgress.userId, userId));

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/leaderboard");
        revalidatePath("/quest");
        revalidatePath(`/lesson/${lessonId}`);

        return;
    }

    // INSERT BARU
    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
        // createdAt otomatis dari DB
    });

    // Points now only updated via fuzzy at level end" 
</xai:function_call name="edit_file">

Wait, second new_str just comment or empty update? Better remove the update if no fields.

To be safe, remove the entire update block for non-practice.

Exact old_str for non-practice:

    // Points updated only at level finish via fuzzy Mamdani
    // No per-question points

new_str: // Points updated only at level finish via fuzzy mamdani

Yes.

Also for challenge-progress.ts: Two places +10 points.

Edit those too.

Multiple edits.

Since parallel.

Also update TODO after.

But limit.

First these. </thinking> 

<xai:function_call name="edit_file">
<parameter name="path">actions/upsert-challenge-progress.ts

    // REVALIDATE
    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/leaderboard");
    revalidatePath("/quest");
    revalidatePath(`/lesson/${lessonId}`);
};