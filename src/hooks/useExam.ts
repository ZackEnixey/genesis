import { useCallback, useEffect, useState } from "react";
import {
  answerInRound,
  nextInRound,
  parseExamState,
  simulatedExamRound,
  startExamRound,
  type Certificate,
  type ExamState,
} from "../lib/quiz.ts";

const STORAGE_KEY = "genesis.exam";
const EMPTY: ExamState = { version: 1, round: null, certificate: null };

function load(): ExamState {
  try {
    return parseExamState(window.localStorage.getItem(STORAGE_KEY)) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

/**
 * Certificate exam state, saved between visits. Only the exam answers and the issued
 * certificate (name, postal address, score, date) are stored: never any card details.
 */
export function useExam() {
  const [state, setState] = useState<ExamState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Saving is a convenience; the exam still works without it.
    }
  }, [state]);

  return {
    round: state.round,
    certificate: state.certificate,
    start: useCallback(() => setState((s) => ({ ...s, round: startExamRound(Math.random) })), []),
    answer: useCallback((choice: number) => setState((s) => (s.round ? { ...s, round: answerInRound(s.round, choice) } : s)), []),
    next: useCallback(() => setState((s) => (s.round ? { ...s, round: nextInRound(s.round) } : s)), []),
    issue: useCallback((certificate: Certificate) => setState((s) => ({ ...s, round: null, certificate })), []),
    send: useCallback(() => setState((s) => (s.certificate ? { ...s, certificate: { ...s.certificate, sent: true } } : s)), []),
    /** Testing only: jump to a passed exam with 14 of 20 correct (70 %). */
    simulatePass: useCallback(() => setState((s) => ({ ...s, round: simulatedExamRound(Math.random, 14) })), []),
  };
}
