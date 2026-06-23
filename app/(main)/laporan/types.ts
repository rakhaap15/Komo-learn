export type QuestionReport = {
  id: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: number;
  isCorrect: boolean;
};

export type Report = {
  name: string;
  score: number;
  timeSpent: number;
  correctCount: number;
  totalQuestions: number;
  questions: QuestionReport[];
};

export type ReportAnalysis = {
  accuracy: number;
  avgTime: number;
  slowCount: number;
  weakCount: number;
  weakTopics: string[];
};

export type ReportHistoryItem = {
  id: number;
  name: string; 
  date: string;
  score: number;
  accuracy: number;
};