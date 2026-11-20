import { describe, expect, it } from "vitest";
import {
  QUESTION_COUNT,
  ROUND_SIZE,
  answerQuestion,
  buildQuestionBank,
  createQuestion,
  initialQuizState,
  isRoundFinished,
  nextQuestion,
  parseQuizState,
  roundScore,
  startRound,
} from "./quiz.ts";

/** Deterministic random numbers for repeatable tests. */
function seeded(seed = 7) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

describe("question bank", () => {
  it("has about 50 unique questions", () => {
    const ids = buildQuestionBank().map((q) => q.id);
    expect(ids.length).toBe(QUESTION_COUNT);
    expect(QUESTION_COUNT).toBeGreaterThanOrEqual(45);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question has four different options including the right answer", () => {
    const random = seeded();
    for (const template of buildQuestionBank()) {
      const q = createQuestion(template.id, random);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => `${o.kind}:${o.value}`)).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it("asks correct facts", () => {
    const random = seeded();
    const answerOf = (id: string) => {
      const q = createQuestion(id, random);
      return q.options[q.answer]?.value;
    };
    expect(answerOf("next-adar")).toBe("nisan");
    expect(answerOf("next-elul")).toBe("tishrei");
    expect(answerOf("month-of-passover")).toBe("nisan");
    expect(answerOf("day-of-hanukkah")).toBe(25);
    expect(answerOf("moon-on-15")).toBe("fullMoon");
    expect(answerOf("leap-per-cycle")).toBe(7);
    expect(answerOf("days-shorter")).toBe(11);
  });
});

describe("rounds", () => {
  it("plays five questions, scores them and finishes", () => {
    const random = seeded();
    let state = startRound(initialQuizState(random), random);
    for (let i = 0; i < ROUND_SIZE; i++) {
      const correct = state.round!.questions[i]!.answer;
      state = answerQuestion(state, i < 3 ? correct : (correct + 1) % 4);
      state = answerQuestion(state, 0); // a second answer is ignored
      state = nextQuestion(state);
    }
    expect(isRoundFinished(state.round!)).toBe(true);
    expect(roundScore(state.round!)).toBe(3);
  });

  it("does not move on before the question is answered", () => {
    const random = seeded();
    const state = startRound(initialQuizState(random), random);
    expect(nextQuestion(state).round!.index).toBe(0);
  });

  it("cycles through the whole bank before repeating a question", () => {
    const random = seeded();
    let state = initialQuizState(random);
    const seen = new Set<string>();
    const rounds = Math.floor(QUESTION_COUNT / ROUND_SIZE);
    for (let r = 0; r < rounds; r++) {
      state = startRound(state, random);
      for (const q of state.round!.questions) {
        expect(seen.has(q.id)).toBe(false);
        seen.add(q.id);
      }
    }
    // The next round wraps around with a fresh order.
    state = startRound(state, random);
    expect(state.round!.questions).toHaveLength(ROUND_SIZE);
  });
});

describe("saving", () => {
  it("round-trips through JSON and rejects bad data", () => {
    const random = seeded();
    const state = answerQuestion(startRound(initialQuizState(random), random), 2);
    expect(parseQuizState(JSON.stringify(state))).toEqual(state);
    expect(parseQuizState("not json")).toBeNull();
    expect(parseQuizState(JSON.stringify({ ...state, version: 2 }))).toBeNull();
    expect(parseQuizState(JSON.stringify({ ...state, order: ["nope"] }))).toBeNull();
    expect(parseQuizState(null)).toBeNull();
  });
});
