/**
 * Verifies the local Hebrew calendar conversion against Hebcal (hebcal.com) for every
 * day in the supported range, in both directions.
 *
 *   npm run verify:hebrew              # 1900-01-01 … 2100-12-31
 *   npm run verify:hebrew -- 2020 2030 # custom Gregorian year range
 *
 * Requires Node ≥ 22.18 (runs the TypeScript sources directly) and network access.
 * Sends only date ranges to Hebcal, no user data.
 */
import { fromDayNumber, toDayNumber } from "../src/lib/gregorian.ts";
import { gregorianToHebrew, hebrewToGregorian } from "../src/lib/hebrew.ts";

const [fromYear = 1900, toYear = 2100] = process.argv.slice(2).map(Number);
const WINDOW_DAYS = 180;
const PAUSE_MS = 300;

const HEBCAL_MONTHS = {
  Tishrei: "tishrei", Cheshvan: "cheshvan", Kislev: "kislev", Tevet: "tevet", "Sh'vat": "shvat",
  Adar: "adar", "Adar I": "adar1", "Adar II": "adar2", Nisan: "nisan", Iyyar: "iyyar",
  Sivan: "sivan", Tamuz: "tamuz", Av: "av", Elul: "elul",
};

const iso = (n) => {
  const { year, month, day } = fromDayNumber(n);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWindow(start, end, attempt = 1) {
  const url = `https://www.hebcal.com/converter?cfg=json&g2h=1&start=${iso(start)}&end=${iso(end)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "genesis-calendar-verification" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).hdates;
  } catch (error) {
    if (attempt >= 4) throw error;
    await sleep(2000 * attempt);
    return fetchWindow(start, end, attempt + 1);
  }
}

const first = toDayNumber({ year: fromYear, month: 1, day: 1 });
const last = toDayNumber({ year: toYear, month: 12, day: 31 });
let checked = 0;
const mismatches = [];

for (let start = first; start <= last; start += WINDOW_DAYS) {
  const end = Math.min(last, start + WINDOW_DAYS - 1);
  const hdates = await fetchWindow(start, end);
  for (let n = start; n <= end; n++) {
    const expected = hdates[iso(n)];
    if (!expected) { mismatches.push(`${iso(n)}: missing from Hebcal response`); continue; }
    const month = HEBCAL_MONTHS[expected.hm];
    const local = gregorianToHebrew(n);
    if (local.year !== expected.hy || local.month !== month || local.day !== expected.hd) {
      mismatches.push(`${iso(n)}: Hebcal ${expected.hd} ${expected.hm} ${expected.hy}, local ${local.day} ${local.month} ${local.year}`);
    }
    const back = hebrewToGregorian({ year: expected.hy, month, day: expected.hd });
    if (expected.hy >= 5660 && expected.hy <= 5860 && (!back.ok || back.dayNumber !== n)) {
      mismatches.push(`${iso(n)}: Hebrew→Gregorian gave ${back.ok ? iso(back.dayNumber) : back.reason}`);
    }
    checked++;
  }
  process.stdout.write(`\rChecked ${checked} days (up to ${iso(end)})…`);
  await sleep(PAUSE_MS);
}

console.log(`\nChecked ${checked} days, ${mismatches.length} mismatches.`);
mismatches.slice(0, 50).forEach((m) => console.log("  " + m));
process.exit(mismatches.length ? 1 : 0);
