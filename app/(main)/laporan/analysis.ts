import { Report, ReportAnalysis } from "./types";

export const analyzeReport = (report: Report): ReportAnalysis => {
  const totalQuestions = report.questions.length;

  const accuracy =
    totalQuestions === 0
      ? 0
      : (report.correctCount / totalQuestions) * 100;

  const avgTime =
    totalQuestions === 0
      ? 0
      : report.timeSpent / totalQuestions;

  const slowThreshold = avgTime * 1.2;

  const slowAnswers = report.questions.filter(
    (q) => q.timeSpent > slowThreshold
  );

  const weakTopics = report.questions
    .filter((q) => !q.isCorrect)
    .map((_, i) => `Topic ${i + 1}`);

  return {
    accuracy,
    avgTime,
    slowCount: slowAnswers.length,
    weakCount: report.questions.filter((q) => !q.isCorrect).length,
    weakTopics,
  };
};