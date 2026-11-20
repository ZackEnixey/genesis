import { describe, expect, it } from "vitest";
import { formatCardNumber, formatExpiry, isValidCardNumber, isValidCvc, isValidEmail, isValidExpiry } from "./payment.ts";
import { EXAM_SIZE, examPassMark, startExamRound } from "./quiz.ts";

describe("checkout validation", () => {
  it("checks card numbers with the Luhn checksum", () => {
    expect(isValidCardNumber("4242 4242 4242 4242")).toBe(true);
    expect(isValidCardNumber("4242 4242 4242 4241")).toBe(false);
    expect(isValidCardNumber("1234")).toBe(false);
  });

  it("formats while typing", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatExpiry("1228")).toBe("12/28");
    expect(formatExpiry("1")).toBe("1");
  });

  it("accepts only future expiry dates", () => {
    const now = new Date(2026, 10, 20);
    expect(isValidExpiry("11/26", now)).toBe(true);
    expect(isValidExpiry("10/26", now)).toBe(false);
    expect(isValidExpiry("13/30", now)).toBe(false);
    expect(isValidExpiry("1230", now)).toBe(false);
  });

  it("checks CVC and email", () => {
    expect(isValidCvc("123")).toBe(true);
    expect(isValidCvc("12")).toBe(false);
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("a@b")).toBe(false);
  });
});

describe("certificate exam", () => {
  it("has 20 different questions and needs more than 60% to pass", () => {
    let s = 3;
    const random = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const round = startExamRound(random);
    expect(round.questions).toHaveLength(EXAM_SIZE);
    expect(new Set(round.questions.map((q) => q.id)).size).toBe(EXAM_SIZE);
    expect(examPassMark(20)).toBe(13);
    expect(examPassMark(10)).toBe(7);
  });
});
