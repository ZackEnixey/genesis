import { useCallback, useEffect, useState } from "react";
import {
  answerQuestion,
  initialQuizState,
  nextQuestion,
  parseQuizState,
  startRound,
  type QuizState,
} from "../lib/quiz.ts";

const STORAGE_KEY = "genesis.quiz";

function load(): QuizState {
  try {
    return parseQuizState(window.localStorage.getItem(STORAGE_KEY)) ?? initialQuizState(Math.random);
  } catch {
    return initialQuizState(Math.random); // storage blocked (e.g. private mode)
  }
}

/** Quiz state that survives leaving the page and reloading: you continue where you stopped. */
export function useQuiz() {
  const [state, setState] = useState<QuizState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Saving is a convenience; the quiz still works without it.
    }
  }, [state]);

  return {
    round: state.round,
    start: useCallback(() => setState((s) => startRound(s, Math.random)), []),
    answer: useCallback((choice: number) => setState((s) => answerQuestion(s, choice)), []),
    next: useCallback(() => setState((s) => nextQuestion(s)), []),
  };
}
