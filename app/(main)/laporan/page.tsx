import {
  getUserProgress,
  getUserSubscription,
  getUserReport,
  getUserReportHistory,
} from "@/db/queries";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Promo } from "@/components/promo";
import { Quest } from "@/components/quest";
import { UserProgress } from "@/components/user-progress";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { redirect } from "next/navigation";
import { PrintButton } from "./print-button";

import { Report, ReportAnalysis, ReportHistoryItem } from "./types";
import { analyzeReport } from "./analysis";
import { Button } from "@/components/ui/button";

type SearchParams = {
  date?: string;
  testResultId?: string;
  type?: "time" | "score" | "analysis" | "recommendation";
  from?: string;
  to?: string;
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const ReportPage = async ({ searchParams }: Props) => {
  const { date, type, from, to, testResultId } = await searchParams;

  //PROMISES
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();


  const historyPromise: Promise<ReportHistoryItem[] | null> =
    from && to
      ? getUserReportHistory(from, to)
      : getUserReportHistory("1900-01-01", "2100-01-01");

  const [userProgress, userSubscription, history] = await Promise.all([
    userProgressPromise,
    userSubscriptionPromise,
    historyPromise,
  ]);

  //GUARD
  if (!userProgress?.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  //REPORT LOGIC
  let report: Report | null = null;
  

  if (date) {
    const reportItem = history?.find(
      (h) =>
        new Date(h.date)
          .toISOString()
          .split("T")[0] === date
    );
    if (reportItem) {
      report = await getUserReport(reportItem.id);
    }
  }

  if (!report) {
    const latestId = history?.[history.length - 1]?.id;

    if (latestId) {
      report = await getUserReport(latestId);
    }
  }
  const analysis: ReportAnalysis | null = report
    ? analyzeReport(report)
    : null;

  //RENDER
  const renderReport = () => {
    if (!report || !analysis) return null;

    switch (type) {
      case "time":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">
              Time Efficiency Report
            </h2>

            <p>Total Time: {report.timeSpent}s</p>

            {(report.questions ?? []).map((q, i) => (
              <div key={q.id} className="p-2 border rounded">
                Q{i + 1}: {q.timeSpent}s
              </div>
            ))}
          </div>
        );

      case "score":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">
              Accuracy Breakdown
            </h2>

            <p>Score: {report.score}</p>
            <p>Accuracy: {analysis.accuracy.toFixed(1)}%</p>

            {(report.questions ?? []).map((q, i) => (
              <div
                key={q.id}
                className={`p-2 border rounded ${
                  q.isCorrect ? "bg-green-100" : "bg-red-100"
                }`}
              >
                Q{i + 1}: {q.isCorrect ? "Correct" : "Wrong"}
              </div>
            ))}
          </div>
        );

      case "analysis":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">
              Cognitive Performance
            </h2>

            <p>Avg Time: {analysis.avgTime.toFixed(2)}s</p>
            <p>Slow Answers: {analysis.slowCount}</p>

            <p className="font-semibold mt-4">Weak Topics:</p>

            <ul className="list-disc ml-5">
              {analysis.weakTopics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        );

      case "recommendation":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">
              Adaptive Learning Path
            </h2>

            <p>Weak Answers: {analysis.weakCount}</p>

            <ul className="list-disc ml-5">
              {analysis.weakTopics.map((t) => (
                <li key={t}>Focus on {t}</li>
              ))}
            </ul>

            <p className="mt-4 font-semibold">Next Step:</p>

            <p>
              {analysis.weakCount > 3
                ? "Review fundamentals first"
                : "Keep learning, never settle for less 🚀"}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  //UI
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points ?? 0}
          hasActiveSubscription={isPro}
        />

        <Promo />
        <Quest points={userProgress.points ?? 0} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/report.svg" alt="Report" width={90} height={90} />

          
          <h1 className="text-2xl font-bold my-6">Report</h1> 
           <p className="text-muted-foreground text-center text-lg mb-6">
                        Review your test results and proficiency progress.
                    </p>
          {/* FILTER */}
          <form
            method="GET"
            action="/laporan"
            className="w-full max-w-md flex flex-col gap-4 mb-8"
          >

            <select
              name="type"
              defaultValue={type}
              className="border p-3 rounded"
            >
              <option value="time">Time</option>
              <option value="score">Score</option>
              <option value="analysis">Analysis</option>
              <option value="recommendation">Recommendation</option>
            </select>

            <input
              type="date"
              name="date"
              defaultValue={date}
              className="border p-3 rounded"
            />

            <Button variant="primary" type="submit" >
              Generate
            </Button>
          </form>

          {/* CONTENT */}
          {!report || !analysis ? (
            <p>No report found</p>
          ) : (
            <div className="w-full max-w-3xl">
              {renderReport()}

              <Separator className="my-6" />

              <PrintButton
                report={report}
                type={type}
                analysis={analysis}
                history={history}
              />
            </div>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ReportPage;