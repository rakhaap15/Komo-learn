// 1. OUTPUT MAPPING (RULE LOGIC)
function getOutput(scoreLabel: string, timeLabel: string): "naik" | "tetap" | "turun" {
  if (scoreLabel === "tinggi" && timeLabel === "cepat") return "naik";
  if (scoreLabel === "tinggi" && timeLabel === "sedang") return "naik";
  if (scoreLabel === "tinggi" && timeLabel === "lama") return "tetap";

  if (scoreLabel === "sedang" && timeLabel === "cepat") return "naik";
  if (scoreLabel === "sedang" && timeLabel === "sedang") return "tetap";
  if (scoreLabel === "sedang" && timeLabel === "lama") return "turun";

  if (scoreLabel === "rendah" && timeLabel === "cepat") return "tetap";
  if (scoreLabel === "rendah" && timeLabel === "sedang") return "turun";
  if (scoreLabel === "rendah" && timeLabel === "lama") return "turun";

  return "tetap";
}

// 2. AUTO RULE GENERATOR
function generateRules(
  scoreF: Record<string, number>,
  timeF: Record<string, number>
) {
  const outputs = {
    naik: 0,
    tetap: 0,
    turun: 0,
  };

  const scoreKeys = Object.keys(scoreF);
  const timeKeys = Object.keys(timeF);

  for (const s of scoreKeys) {
    for (const t of timeKeys) {
      const nilaiRule = Math.min(scoreF[s], timeF[t]); // AND = MIN
      const keputusan = getOutput(s, t);

      outputs[keputusan] = Math.max(outputs[keputusan], nilaiRule); // OR = MAX
    }
  }

  return outputs;
}

// 3. MAIN FUNCTION (FUZZY MAMDANI)
export function fuzzyDecision(score: number, time: number): { decision: "naik" | "tetap" | "turun"; crisp: number } {
  // FUZZIFICATION
  const scoreF = {
    rendah: Math.max(0, Math.min(1, (50 - score) / 50)),
    sedang: Math.max(0, Math.min(1, (score - 40) / 35, (75 - score) / 35)),
    tinggi: Math.max(0, Math.min(1, (score - 70) / 30)),
  };

  const timeF = {
    cepat: Math.max(0, Math.min(1, (25 - time) / 10)),
    sedang: Math.max(0, Math.min(1, (time - 20) / 5, (35 - time) / 10)),
    lama: Math.max(0, Math.min(1, (time - 30) / 10)),
  };

  // AUTO RULE (MAMDANI)
  const rules = generateRules(scoreF, timeF);

  // DEFUZZIFICATION (CENTROID)
  const total = rules.turun + rules.tetap + rules.naik;

  // Hindari pembagian nol
  if (total === 0) return { decision: "tetap", crisp: 50 };

  const defuzz =
    (rules.turun * 0 +
     rules.tetap * 50 +
     rules.naik * 100) / total;

  // FINAL DECISION
  const decision = defuzz >= 75 ? "naik" : defuzz >= 50 ? "tetap" : "turun";
  return { decision, crisp: defuzz };
}
