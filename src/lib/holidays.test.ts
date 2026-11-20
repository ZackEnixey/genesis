import { describe, expect, it } from "vitest";
import { toDayNumber } from "./gregorian.ts";
import { gregorianToHebrew } from "./hebrew.ts";
import { holidaysOn } from "./holidays.ts";

const on = (year: number, month: number, day: number) => {
  const n = toDayNumber({ year, month, day });
  return holidaysOn(n, gregorianToHebrew(n));
};

describe("holidays", () => {
  // Reference dates checked against hebcal.com (Israel schedule).
  it.each([
    [[2024, 10, 3], ["roshHashanah"]],
    [[2024, 10, 12], ["yomKippur"]],
    [[2024, 10, 17], ["sukkot"]],
    [[2024, 12, 26], ["hanukkah"]], // 25 Kislev
    [[2025, 1, 1], ["roshChodesh", "hanukkah"]], // 1 Tevet, 7th day of Hanukkah
    [[2025, 2, 13], ["tuBishvat"]],
    [[2024, 3, 24], ["purim"]], // 14 Adar II in a leap year
    [[2025, 3, 14], ["purim"]], // 14 Adar in a common year
    [[2024, 4, 23], ["passover"]],
    [[2024, 5, 26], ["lagBaomer"]],
    [[2024, 6, 12], ["shavuot"]],
    [[2024, 8, 19], ["tuBav"]],
  ] as const)("%j → %j", ([y, m, d], expected) => {
    expect(on(y, m, d)).toEqual(expected);
  });

  it("has nothing on an ordinary day", () => {
    expect(on(2026, 11, 20)).toEqual([]);
  });
});
