"use client";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useState, useEffect, useRef, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { saveResult } from "@/actions/save-result";
import Confetti from "react-confetti";
import { useAudio, useWindowSize } from "react-use";
import { addPoints } from "@/actions/add-points";

type AttemptRow = {
  index: number;
  challengeId: number;
  type: "SELECT" | "INPUT" | "ASSIST";
  isCorrect: boolean;
  timeSpent: number;
  userAnswer: string;
  correctAnswer: string;
};

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  // legacy prop dari beberapa halaman (tidak dipakai di komponen ini)
};

function getLevel(score: number, time: number) {
    // 🟢 VERY LOW PERFORMANCE
    if (score < 30 && time > 1200) return "Basic";
    if (score < 30 && time <= 1200) return "Basic";

    // 🟢 LOW BASIC
    if (score >= 30 && score < 40 && time > 1200) return "Basic";
    if (score >= 30 && score < 40 && time <= 1200) return "Basic";

    // 🟡 HIGH BASIC BORDER
    if (score >= 40 && score < 45 && time > 1200) return "Basic";
    if (score >= 40 && score < 45 && time <= 1200) return "Basic";

    // 🟡 EARLY INTERMEDIATE
    if (score >= 45 && score < 55 && time > 1000) return "Intermediate";
    if (score >= 45 && score < 55 && time <= 1000) return "Intermediate";

    // 🟡 MID INTERMEDIATE
    if (score >= 55 && score < 65 && time > 900) return "Intermediate";
    if (score >= 55 && score < 65 && time <= 900) return "Intermediate";

    // 🟡 HIGH INTERMEDIATE
    if (score >= 65 && score < 75 && time > 900) return "Intermediate";
    if (score >= 65 && score < 75 && time <= 900) return "Intermediate";

    // 🔵 BORDER ADVANCED
    if (score >= 75 && score < 80 && time > 800) return "Intermediate";
    if (score >= 75 && score < 80 && time <= 800) return "Advanced";

    // 🔵 ADVANCED BASE
    if (score >= 80 && score < 85 && time > 700) return "Advanced";
    if (score >= 80 && score < 85 && time <= 700) return "Advanced";

    // 🔵 HIGH ADVANCED
    if (score >= 85 && score < 90 && time > 600) return "Advanced";
    if (score >= 85 && score < 90 && time <= 600) return "Advanced";

    // 🔥 MASTER LEVEL
    if (score >= 90 && time > 600) return "Advanced";
    if (score >= 90 && time <= 600) return "Advanced";

    return "Basic";
}

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
}: Props) => {
  const router = useRouter();
  const [pending] = useTransition();

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(
    initialPercentage === 100 ? 0 : initialPercentage
  );
  const [challenges] = useState(initialLessonChallenges);

  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 SCORE
  const [correctCount, setCorrectCount] = useState(0);

  // 🔥 TIMER
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //use window
  const { width, height } = useWindowSize();

  //finish audio
   const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true});

  // 🔥 STATE
  const [selectedOption, setSelectedOption] = useState<number>();
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const [attemptRows, setAttemptRows] = useState<AttemptRow[]>([]);
  const questionStartAtRef = useRef<number>(0);

  useEffect(() => {
    questionStartAtRef.current = Date.now();
  }, [activeIndex]);

  // 🔊 AUDIO
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audioRef.current || !challenge?.audioSrc) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const normalize = (text: string) => text.trim().toLowerCase();

  // =========================
  // 🔥 CONTINUE BUTTON LOGIC
  // =========================
  const onContinue = () => {
    if (!challenge) return;


  console.log("CLICK");

  // =========================
  // STEP 2 → NEXT
  // =========================
  if (status === "correct") {
    console.log("➡️ NEXT QUESTION");
    setStatus("none");
    setSelectedOption(undefined);
    setUserAnswer("");
    setActiveIndex((prev) => prev + 1);
    return;
  }

  if (status === "wrong") {
    console.log("🔁 RESET WRONG");
    setStatus("none");
    setSelectedOption(undefined);
    return;
  }

  // =========================
  // STEP 1 → CHECK
  // =========================

  // INPUT
  if (challenge.type === "INPUT") {
    if (!userAnswer) return;

    const correctAnswers = options
      .filter((o) => o.correct)
      .map((o) => o.text);

    const isCorrect = correctAnswers.some((ans) =>
      normalize(userAnswer).includes(normalize(ans))
    );

    console.log("isCorrect INPUT:", isCorrect);

    if (isCorrect) {
      console.log("✅ TAMBAH SCORE INPUT");
      setCorrectCount((prev) => prev + 1);
      setPercentage((prev) => prev + 100 / challenges.length);
      setStatus("correct");
      // tambah points saat jawaban benar
      addPoints(10).catch(() => {});

    } else {
      console.log("❌ SALAH INPUT");
      setHearts((prev) => Math.max(prev - 1, 0));
      setStatus("wrong");
    }

    return;
  }

  // SELECT
  if (!selectedOption) {
    console.log("❌ selectedOption kosong");
    return;
  }

  const correctOption = options.find((o) => o.correct);

  if (!correctOption) {
    console.log("❌ TIDAK ADA correctOption");
    return;
  }

  console.log("COMPARE:", selectedOption, correctOption.id);

  if (selectedOption === correctOption.id) {
    console.log("✅ TAMBAH SCORE SELECT");
    setCorrectCount((prev) => prev + 1);
    setPercentage((prev) => prev + 100 / challenges.length);
    setStatus("correct");
    // tambah points saat jawaban benar
    addPoints(10).catch(() => {});

  } else {
    console.log("❌ SALAH SELECT");
    setHearts((prev) => Math.max(prev - 1, 0));
    setStatus("wrong");
  }
};

  // =========================
  // 💾 SAVE RESULT
  // =========================
  const savedRef = useRef(false);

  const totalQuestions = challenges.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const level = getLevel(score, timeSpent);

  useEffect(() => {
    if (!challenge && !savedRef.current) {
      savedRef.current = true;

      saveResult({
      score,
      timeSpent,
      correctCount,
      totalQuestions,
      level,
});
    }
  }, [challenge]);

  // =========================
    // FINISH SCREEN
    // =========================
    if (!challenge) {
        return (
            <>
            {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={600}
                    tweenDuration={10000}
                />

                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">


                    <Image
                        src="/finish.svg"
                        alt="finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />

                    <Image
                        src="/finish.svg"
                        alt="finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />

                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br /> you&apos;ve completed the lesson.
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center gap-x-4 w-full">
                            <ResultCard variant="score" value={score} />
                            <ResultCard
                                variant="time"
                                value={Math.floor(timeSpent / 60)}
                            />
                        </div>


                        <div className="flex items-center gap-x-4 w-full">
                            <ResultCard variant="level" value={level} />
                        </div>

                    </div>
                </div>

                <Footer
                    lessonId={initialLessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }

  const title =
    challenge.type === "ASSIST"
      ? "Choose the correct answer below"
      : challenge.question;

  return (
    <>
      <audio ref={audioRef} src={challenge.audioSrc ?? undefined} />

      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={false}
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="lg:w-[600px] w-full px-6 flex flex-col gap-6">

          {challenge.audioSrc && (
            <button onClick={playAudio}>🔊</button>
          )}

          {challenge.imageSrc && (
            <Image src={challenge.imageSrc} width={120} height={120} alt="img" />
          )}

          {challenge.passage && <p>{challenge.passage}</p>}

          <h1 className="text-xl font-bold">{title}</h1>

          {challenge.type === "ASSIST" && (
            <QuestionBubble question={challenge.question} />
          )}

          {challenge.type === "INPUT" && (
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border p-2"
            />
          )}

          {challenge.type !== "INPUT" && (
            <Challenge
              options={options}
              onSelect={(id) => setSelectedOption(id)}
              selectedOption={selectedOption}
              disabled={false}
              status={status}
              type={challenge.type}

            />
          )}
        </div>
      </div>

      <Footer
        disabled={
          challenge.type === "INPUT"
            ? !userAnswer
            : !selectedOption
        }
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};