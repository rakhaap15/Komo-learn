// @ts-nocheck
import { fuzzyDecision } from "./lib/fuzzy";

const tests = [
  { score: 90, time: 8 },
  { score: 75, time: 12 },
  { score: 60, time: 15 },
  { score: 40, time: 20 },
  { score: 20, time: 25 },
];

tests.forEach((t, i) => {
  const result = fuzzyDecision(t.score, t.time);
  console.log(`Test ${i + 1}:`, t, "=>", result);
});