"use client";

import { jsPDF } from "jspdf";
import { Report, ReportAnalysis, ReportHistoryItem } from "./types";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  report: Report | null;
  type?: string;
  analysis: ReportAnalysis | null;
  history?: ReportHistoryItem[] | null;
}

//IMAGE LOADER
const loadImage = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve("");

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve("");
      }
    };

    img.onerror = () => resolve("");
  });
};

export const PrintButton = ({
  report,
  type,
  analysis,
}: Props) => {
  const handlePrint = useCallback(async () => {
    if (!report || !analysis) {
      alert("Report kosong");
      return;
    }
    const logo = await loadImage("/komo mascots.svg");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const margin = 14;
    let y = 20;

    const line = (yPos: number) => {
      pdf.line(margin, yPos, pageWidth - margin, yPos);
    };

    const addTitle = () => {
    if (logo && logo.startsWith("data:image")) {
      try {
        pdf.addImage(logo, "PNG", margin, 8, 20, 20);
      } catch (error) {
        console.error(error);
      }
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text("KOMOLEARN REPORT", pageWidth / 2, 18, {
      align: "center",
    });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    line(34);
    y = 42;
  };

   const addTableHeader = () => {
    pdf.setFont("helvetica", "bold");

    pdf.text("No", 16, y);
    pdf.text("Question", 28, y);
    pdf.text("Answer", 95, y);
    pdf.text("Time", 145, y);
    pdf.text("Result", 170, y);

    y += 6;
    line(y);
    y += 6;
  };

  const addTimeTableHeader = () => {
    pdf.setFont("helvetica","bold");

    pdf.text("No",16,y);
    pdf.text("Question",30,y);
    pdf.text("Time",145,y);
    pdf.text("Category", 170, y);

    y += 6;

    line(y);

    y += 6;
};

    const addRow = (
    no: number,
    question: string,
    answer: string,
    time: number,
    result: string
  ) => {
    
    pdf.setFont("helvetica", "normal");

    const safeQuestionText = question ?? "-";
    const safeAnswerText = answer ?? "-";

    const safeQuestion =
    safeQuestionText.length > 30
      ? safeQuestionText.slice(0, 30) + "..."
      : safeQuestionText;

    const safeAnswer =
    safeAnswerText.length > 15
      ? safeAnswerText.slice(0, 15) + "..."
      : safeAnswerText;

    pdf.text(String(no), 16, y);
    pdf.text(safeQuestion, 28, y);
    pdf.text(safeAnswer, 95, y);
    pdf.text(`${time}s`, 145, y);
    pdf.text(result, 170, y);

    y += 7;
  };

  const checkPage = () => {
    if (y > 270) {

        pdf.addPage();

        addTitle();

        y = 50;

        switch ((type ?? "").toLowerCase()) {

            case "score":
                addTableHeader();
                break;

            case "time":
                addTimeTableHeader();
                break;
        }
    }
};

const generateScoreReport = () => {

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");

  pdf.text("Student Information", margin, y);

  y += 8;

  pdf.setFont("helvetica", "normal");

  pdf.text(`Student : ${report.name ?? "-"}`, margin, y);
  y += 6;

  pdf.text(`Score : ${report.score}`, margin, y);
  y += 6;

  pdf.text(
  `Category : ${report.level ?? "-"}`,
  margin,
  y
  );

  y += 6;

  pdf.text(`Accuracy : ${analysis.accuracy.toFixed(1)}%`, margin, y);
  y += 6;

  pdf.text(`Time Spent : ${report.timeSpent}s`, margin, y);
  y += 6;

  pdf.text(
    `Generated : ${new Date().toLocaleDateString()}`,
    margin,
    y
  );

  y += 10;

  line(y);

  y += 8;

  addTableHeader();

  (report.questions ?? []).forEach((q, i) => {

      checkPage();
  
    addRow(
      i + 1,
      q.question ?? "-",
      q.userAnswer ?? "-",
      q.timeSpent ?? 0,
      q.isCorrect ? "Correct" : "Wrong"
    );

  });
};

const generateTimeReport = () => {

  const getTimeLevel = (seconds: number) => {
  if (seconds >= 1000) return "Slow";
  if (seconds >= 800) return "Moderate";
  return "Fast";
  };

  const totalQuestions = report.questions?.length ?? 0;

  const averageTime =
  totalQuestions > 0
    ? (report.timeSpent / totalQuestions).toFixed(2)
    : "0.00";

  pdf.setFontSize(11);
  pdf.setFont("helvetica","bold");

  pdf.text("Time Report", margin, y);

  y += 8;

  pdf.setFont("helvetica","normal");

  pdf.text(`Student : ${report.name ?? "-"}`, margin, y);
  y += 6;

  pdf.text(`Total Time : ${report.timeSpent}s`, margin, y);
  y += 6;

  pdf.text(
  `Category : ${getTimeLevel(report.timeSpent)}`,
  margin,
  y
  );

y += 6;

  pdf.text(
  `Average Time : ${averageTime}s`,
  margin,
  y
  );

  y += 10;

  line(y);

  y += 8;

  addTimeTableHeader();

  pdf.setFont("helvetica","normal");

  (report.questions ?? []).forEach((q, i) => {

    checkPage();

    pdf.text(String(i+1),16,y);

    const question = q.question ?? "-";

    pdf.text(
      question.length > 40
        ? question.slice(0, 40) + "..."
        : question,
      30,
      y
    );

    pdf.text(`${q.timeSpent}s`,145,y);

    pdf.text(
    getTimeLevel(q.timeSpent ?? 0),
    170,
    y
  );

    y += 7;

  });

};

const generateAnalysisReport = () => {

  const totalCorrect =
  (report.questions ?? []).filter(q => q.isCorrect).length;

  const totalIncorrect =
  (report.questions ?? []).filter(q => !q.isCorrect).length;

  pdf.setFontSize(11);

  pdf.setFont("helvetica","bold");

  pdf.text("Performance Analysis", margin, y);

  y += 8;

  pdf.setFont("helvetica","normal");

  pdf.text(`Student : ${report.name ?? "-"}`, margin, y);

  y += 6;

  pdf.text(`Score : ${report.score}`, margin, y);

  y += 6;

  pdf.text(`Accuracy : ${analysis.accuracy.toFixed(1)}%`, margin, y);

  y += 6;

  pdf.text(
    `Correct : ${totalCorrect}`,
    margin,
    y
  );

  y += 6;

  pdf.text(
    `Wrong : ${totalIncorrect}`,
    margin,
    y
  );

  y += 12;

  pdf.setFont("helvetica","bold");

  pdf.text("Analysis", margin, y);

  y += 8;

  pdf.setFont("helvetica","normal");

  let result = "";

  if (analysis.accuracy >= 90)
    result = "Excellent performance.";

  else if (analysis.accuracy >= 75)
    result = "Good performance.";

  else if (analysis.accuracy >= 60)
    result = "Fair performance.";

  else
    result = "Needs improvement.";

  checkPage();

  const lines = pdf.splitTextToSize(result, 170);

  pdf.text(lines, margin, y);

  y += lines.length * 6;

};

const generateRecommendationReport = () => {

  pdf.setFontSize(11);

  pdf.setFont("helvetica","bold");

  pdf.text("Learning Recommendation", margin, y);

  y += 10;

  pdf.setFont("helvetica","normal");

  let recommendation = "";

  if (analysis.accuracy >= 90) {

    recommendation =
      "Maintain your excellent performance by practicing more advanced exercises.";

  } else if (analysis.accuracy >= 75) {

    recommendation =
      "Review incorrect answers and continue practicing similar questions.";

  } else if (analysis.accuracy >= 60) {

    recommendation =
      "Increase study time and revisit learning materials regularly.";

  } else {

    recommendation =
      "Start reviewing the material from the beginning and seek additional guidance.";

  }

  pdf.text(`Student : ${report.name ?? "-"}`, margin, y);

  y += 8;

  pdf.text(
    `Accuracy : ${analysis.accuracy.toFixed(1)}%`,
    margin,
    y
  );

  y += 12;

  pdf.setFont("helvetica","bold");

  pdf.text("Recommendation", margin, y);

  y += 8;

  pdf.setFont("helvetica","normal");

  checkPage();

  const lines = pdf.splitTextToSize(recommendation, 170);

  pdf.text(lines, margin, y);

  y += lines.length * 6;

};

  const generateReportContent = () => {
  switch ((type ?? "").toLowerCase()) {
    case "score":
      console.log(report);
      generateScoreReport();
      break;

    case "time":
      generateTimeReport();
      break;

    case "analysis":
      generateAnalysisReport();
      break;

    case "recommendation":
      generateRecommendationReport();
      break;

    default:
      generateScoreReport();
  }
};

    //START
    addTitle();
    generateReportContent();

    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      pdf.setFontSize(8);

      pdf.text(
        "Generated by KomoLearn",
        pageWidth / 2,
        290,
        { align: "center" }
      );
    }

    pdf.save(`${(type ?? "report").toLowerCase()}-komolearn.pdf`);
  }, [report, analysis, type]);

  return (
    <Button
    variant="secondary"
      type="button"
      onClick={handlePrint}
      className="w-full"
    >
      Export PDF
    </Button>
  );
};