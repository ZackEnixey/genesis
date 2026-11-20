/**
 * Hebrew-months quiz: a bank of questions built from calendar data, played in rounds
 * of five. Rounds walk through a shuffled order of the whole bank, so players see new
 * questions each time until every question has appeared, then the order reshuffles.
 *
 * Questions store translation keys, never text, so they work in every language and
 * a saved quiz still reads correctly after the language changes.
 */
import type { HebrewMonthKey } from "./hebrew.ts";
import type { HolidayKey } from "./holidays.ts";
import type { MoonPhaseKey } from "./simulation.ts";

export type QuizValue =
  | { kind: "month"; value: HebrewMonthKey }
  | { kind: "holiday"; value: HolidayKey }
  | { kind: "phase"; value: MoonPhaseKey }
  | { kind: "number"; value: number };

export interface QuizQuestion {
  id: string;
  /** Translation key of the question, e.g. "quiz.q.nextMonth". */
  stem: string;
  params: Record<string, QuizValue>;
  options: QuizValue[];
  /** Index of the correct option. */
  answer: number;
  /** Translation key of the explanation shown after answering. */
  explain: string;
}

interface Template {
  id: string;
  stem: string;
  params?: Record<string, QuizValue>;
  answer: QuizValue;
  distractors: QuizValue[];
  explain: string;
}

export const ROUND_SIZE = 5;

const month = (value: HebrewMonthKey): QuizValue => ({ kind: "month", value });
const holiday = (value: HolidayKey): QuizValue => ({ kind: "holiday", value });
const phase = (value: MoonPhaseKey): QuizValue => ({ kind: "phase", value });
const num = (value: number): QuizValue => ({ kind: "number", value });

/** The months of a common (non-leap) year, starting from Tishrei. */
const YEAR: HebrewMonthKey[] = ["tishrei", "cheshvan", "kislev", "tevet", "shvat", "adar", "nisan", "iyyar", "sivan", "tamuz", "av", "elul"];

const HOLIDAY_DATES: ReadonlyArray<[HolidayKey, HebrewMonthKey, number]> = [
  ["roshHashanah", "tishrei", 1],
  ["yomKippur", "tishrei", 10],
  ["sukkot", "tishrei", 15],
  ["hanukkah", "kislev", 25],
  ["tuBishvat", "shvat", 15],
  ["purim", "adar", 14],
  ["passover", "nisan", 15],
  ["lagBaomer", "iyyar", 18],
  ["shavuot", "sivan", 6],
  ["tuBav", "av", 15],
];

const DAY_CHOICES = [1, 6, 10, 14, 15, 18, 25, 29];
const otherMonths = (...exclude: HebrewMonthKey[]) => YEAR.filter((m) => !exclude.includes(m)).map(month);

export function buildQuestionBank(): Template[] {
  const bank: Template[] = [];

  YEAR.forEach((m, i) => {
    const next = YEAR[(i + 1) % YEAR.length] ?? "tishrei";
    bank.push({
      id: `next-${m}`,
      stem: "quiz.q.nextMonth",
      params: { month: month(m) },
      answer: month(next),
      distractors: otherMonths(m, next),
      explain: `monthInfo.${next}`,
    });
  });

  for (const [h, m, day] of HOLIDAY_DATES) {
    bank.push({
      id: `month-of-${h}`,
      stem: "quiz.q.holidayMonth",
      params: { holiday: holiday(h) },
      answer: month(m),
      distractors: otherMonths(m),
      explain: `monthInfo.${m}`,
    });
    bank.push({
      id: `day-of-${h}`,
      stem: "quiz.q.holidayDay",
      params: { holiday: holiday(h) },
      answer: num(day),
      distractors: DAY_CHOICES.filter((d) => d !== day).map(num),
      explain: `monthInfo.${m}`,
    });
  }

  const quarters: ReadonlyArray<[number, MoonPhaseKey]> = [[1, "newMoon"], [8, "firstQuarter"], [15, "fullMoon"], [22, "lastQuarter"]];
  for (const [day, p] of quarters) {
    bank.push({
      id: `moon-on-${day}`,
      stem: "quiz.q.moonOnDay",
      params: { day: num(day) },
      answer: phase(p),
      distractors: quarters.filter(([, q]) => q !== p).map(([, q]) => phase(q)),
      explain: `phaseInfo.${p}`,
    });
  }

  const facts: Template[] = [
    { id: "months-common", stem: "quiz.q.monthsCommon", answer: num(12), distractors: [10, 11, 13, 14].map(num), explain: "quiz.explainDaysShorter" },
    { id: "months-leap", stem: "quiz.q.monthsLeap", answer: num(13), distractors: [11, 12, 14, 15].map(num), explain: "monthInfo.adar1" },
    { id: "leap-per-cycle", stem: "quiz.q.leapPerCycle", answer: num(7), distractors: [3, 4, 5, 12].map(num), explain: "monthInfo.adar1" },
    { id: "cycle-length", stem: "quiz.q.cycleLength", answer: num(19), distractors: [7, 12, 28, 33].map(num), explain: "quiz.explainDaysShorter" },
    { id: "longest-month", stem: "quiz.q.longestMonth", answer: num(30), distractors: [28, 29, 31, 32].map(num), explain: "monthInfo.cheshvan" },
    { id: "days-shorter", stem: "quiz.q.daysShorter", answer: num(11), distractors: [3, 5, 19, 29].map(num), explain: "quiz.explainDaysShorter" },
    { id: "month-start", stem: "quiz.q.monthStart", answer: phase("newMoon"), distractors: [phase("firstQuarter"), phase("fullMoon"), phase("lastQuarter")], explain: "phaseInfo.newMoon" },
    { id: "added-month", stem: "quiz.q.addedMonth", answer: month("adar1"), distractors: otherMonths("adar"), explain: "monthInfo.adar1" },
    { id: "first-month", stem: "quiz.q.firstMonth", answer: month("nisan"), distractors: otherMonths("nisan"), explain: "monthInfo.nisan" },
    { id: "no-festivals", stem: "quiz.q.noFestivals", answer: month("cheshvan"), distractors: [month("tishrei"), month("nisan"), month("kislev"), month("sivan")], explain: "monthInfo.cheshvan" },
    { id: "hanukkah-ends", stem: "quiz.q.hanukkahEnds", params: { month: month("kislev") }, answer: month("tevet"), distractors: otherMonths("kislev", "tevet"), explain: "monthInfo.tevet" },
    { id: "full-moon-festival", stem: "quiz.q.fullMoonFestival", answer: holiday("passover"), distractors: [holiday("hanukkah"), holiday("roshHashanah"), holiday("shavuot"), holiday("yomKippur")], explain: "phaseInfo.fullMoon" },
  ];
  bank.push(...facts);
  return bank;
}

const BANK = buildQuestionBank();
const BY_ID = new Map(BANK.map((t) => [t.id, t]));
export const QUESTION_COUNT = BANK.length;

export type Random = () => number;

function shuffle<T>(items: readonly T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

const sameValue = (a: QuizValue, b: QuizValue) => a.kind === b.kind && a.value === b.value;

export function createQuestion(id: string, random: Random): QuizQuestion {
  const template = BY_ID.get(id);
  if (!template) throw new Error(`Unknown quiz question "${id}".`);
  const distractors = shuffle(template.distractors.filter((d) => !sameValue(d, template.answer)), random).slice(0, 3);
  const options = shuffle([template.answer, ...distractors], random);
  return {
    id,
    stem: template.stem,
    params: template.params ?? {},
    options,
    answer: options.findIndex((o) => sameValue(o, template.answer)),
    explain: template.explain,
  };
}

export interface QuizRound {
  questions: QuizQuestion[];
  /** Current question; equals questions.length once the round is finished. */
  index: number;
  /** Chosen option per question, or null while unanswered. */
  answers: (number | null)[];
}

export interface QuizState {
  version: 1;
  /** Shuffled order of every question id. */
  order: string[];
  /** Where the next round starts in `order`. */
  cursor: number;
  round: QuizRound | null;
}

export function initialQuizState(random: Random): QuizState {
  return { version: 1, order: shuffle(BANK.map((t) => t.id), random), cursor: 0, round: null };
}

export function startRound(state: QuizState, random: Random): QuizState {
  let { order, cursor } = state;
  if (cursor + ROUND_SIZE > order.length) {
    order = shuffle(BANK.map((t) => t.id), random);
    cursor = 0;
  }
  const ids = order.slice(cursor, cursor + ROUND_SIZE);
  return {
    ...state,
    order,
    cursor: cursor + ROUND_SIZE,
    round: { questions: ids.map((id) => createQuestion(id, random)), index: 0, answers: ids.map(() => null) },
  };
}

/** Records the answer to the current question (only once). */
export function answerInRound(round: QuizRound, choice: number): QuizRound {
  if (round.index >= round.questions.length || round.answers[round.index] !== null) return round;
  const answers = [...round.answers];
  answers[round.index] = choice;
  return { ...round, answers };
}

/** Moves on, but only after the current question has been answered. */
export function nextInRound(round: QuizRound): QuizRound {
  if (round.answers[round.index] === null || round.answers[round.index] === undefined) return round;
  return { ...round, index: round.index + 1 };
}

export function answerQuestion(state: QuizState, choice: number): QuizState {
  return state.round ? { ...state, round: answerInRound(state.round, choice) } : state;
}

export function nextQuestion(state: QuizState): QuizState {
  return state.round ? { ...state, round: nextInRound(state.round) } : state;
}

export function roundScore(round: QuizRound): number {
  return round.questions.reduce((sum, q, i) => sum + (round.answers[i] === q.answer ? 1 : 0), 0);
}

export function isRoundFinished(round: QuizRound): boolean {
  return round.index >= round.questions.length;
}

function isValidRound(round: unknown): round is QuizRound {
  if (!round || typeof round !== "object") return false;
  const { questions, answers, index } = round as QuizRound;
  if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length !== answers.length) return false;
  if (typeof index !== "number" || index < 0 || index > questions.length) return false;
  return questions.every((q) => BY_ID.has(q.id) && Array.isArray(q.options) && q.options.length === 4);
}

/* ---- Certificate exam ---- */

export const EXAM_SIZE = 20;

/** "More than 60 %" correct: 13 of 20. */
export function examPassMark(total: number): number {
  return Math.floor(total * 0.6) + 1;
}

/** For testing: a finished exam with `correct` right answers (the rest wrong). */
export function simulatedExamRound(random: Random, correct: number, size = EXAM_SIZE): QuizRound {
  const round = startExamRound(random, size);
  const answers = round.questions.map((q, i) => (i < correct ? q.answer : (q.answer + 1) % q.options.length));
  return { ...round, answers, index: size };
}

export function startExamRound(random: Random, size = EXAM_SIZE): QuizRound {
  const ids = shuffle(BANK.map((t) => t.id), random).slice(0, size);
  return { questions: ids.map((id) => createQuestion(id, random)), index: 0, answers: ids.map(() => null) };
}

export interface Certificate {
  name: string;
  /** Postal address the printed certificate goes to (one line). */
  address: string;
  score: number;
  total: number;
  /** Day number of the date it was issued. */
  issuedOn: number;
  /** True once the person pressed "Send". */
  sent: boolean;
}

export interface ExamState {
  version: 1;
  round: QuizRound | null;
  certificate: Certificate | null;
}

export function parseExamState(raw: string | null): ExamState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ExamState;
    if (data?.version !== 1) return null;
    if (data.round !== null && !isValidRound(data.round)) return null;
    const c = data.certificate;
    if (c !== null && (typeof c?.name !== "string" || typeof c.score !== "number" || typeof c.total !== "number")) return null;
    return data;
  } catch {
    return null;
  }
}

/** Validates saved data; anything unexpected (e.g. an old version) starts fresh. */
export function parseQuizState(raw: string | null): QuizState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as QuizState;
    if (data?.version !== 1 || !Array.isArray(data.order) || typeof data.cursor !== "number") return null;
    if (!data.order.every((id) => BY_ID.has(id))) return null;
    if (data.round && !isValidRound(data.round)) return null;
    return data;
  } catch {
    return null;
  }
}
