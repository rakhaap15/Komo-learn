import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Promo } from "@/components/promo";
import { Quest } from "@/components/quest";
import { UserProgress } from "@/components/user-progress";
import { Separator } from "@/components/ui/separator";

import {
  getUserProgress,
  getUserSubscription,
  getUserReport,
} from "@/db/queries";

import Image from "next/image";
import { redirect } from "next/navigation";
import { PrintButton } from "./print-button";

const ReportPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const reportData = getUserReport();

  const [userProgress, userSubscription, report] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    reportData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  // ✅ HANDLE NULL REPORT
  if (!report) {
    return (
      <FeedWrapper>
        <div className="w-full flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">
            Belum ada data laporan.
          </p>
        </div>
      </FeedWrapper>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* SIDEBAR */}
      <StickyWrapper className="no-print">
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        <Promo />
        <Quest points={userProgress.points} />
      </StickyWrapper>

      {/* MAIN */}
      <FeedWrapper>
        <div id="report-content" className="w-full flex flex-col items-center">
          <Image src="/report.svg" alt="Report" height={90} width={90} />

          <h1 className="text-center font-bold text-2xl my-6">
            Report
          </h1>

          <p className="text-muted-foreground text-center mb-6">
            Review your personal performance and track your progress over time.
          </p>

          {/* ======================
              LAPORAN 1 - WAKTU
          ====================== */}
          <div className="w-full mb-8">
            <h2 className="font-bold text-lg mb-4">
              Laporan 1: Waktu
            </h2>

            <p className="mb-2">
              Total Waktu:{" "}
              <span className="font-semibold">
                {report.totalTime} detik
              </span>
            </p>

            <div className="space-y-2">
              {report.questions.map((q, index) => (
                <div
                  key={q.id}
                  className="p-3 rounded-lg border flex justify-between"
                >
                  <p>Soal {index + 1}</p>
                  <p>{q.timeSpent} detik</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="mb-6 w-full" />

          {/* ======================
              LAPORAN 2 - NILAI
          ====================== */}
          <div className="w-full">
            <h2 className="font-bold text-lg mb-4">
              Laporan 2: Nilai
            </h2>

            <p className="mb-2">
              Total Nilai:{" "}
              <span className="font-semibold">
                {report.score}
              </span>
            </p>

            <p className="mb-4">
              Benar: {report.correctCount} / {report.totalQuestions}
            </p>

            <div className="space-y-2">
              {report.questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border flex justify-between ${
                    q.isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p>Soal {index + 1}</p>
                  <p>{q.isCorrect ? "Benar" : "Salah"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ✅ CLIENT BUTTON */}
          <PrintButton />
                <Separator className="mb-6 w-1/2 mx-auto" />
      </FeedWrapper>
    </div>
  );
};

export default ReportPage;