import { expect, test, type Page } from "@playwright/test";

const summary = (page: Page) => page.getByRole("region", { name: "Selected date" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Choose a date" });

test.beforeEach(async ({ page }) => {
  // Freeze "today" so assertions are stable.
  // Each test runs in a fresh browser context, so storage starts empty.
  await page.clock.setFixedTime(new Date("2026-11-20T10:00:00"));
});

function collectProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  return problems;
}

test("loads on today's date without errors or horizontal overflow", async ({ page }) => {
  const problems = collectProblems(page);
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1, name: "Discover your Hebrew birthday" })).toBeVisible();
  await expect(summary(page)).toContainText("Friday");
  await expect(summary(page)).toContainText("20 November 2026");
  await expect(summary(page)).toContainText("10 Kislev 5787");
  await expect(summary(page)).toContainText("Waxing gibbous");
  await expect(page.getByRole("img", { name: /Model of the Sun, Earth and Moon on 20 November 2026/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  // Every image loaded.
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
  expect(problems).toEqual([]);
});

test("enters a Gregorian date", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await expect(d).toBeVisible();
  await d.getByLabel("Day").selectOption("14");
  await d.getByLabel("Month").selectOption({ label: "May" });
  await d.getByLabel("Year").fill("1948");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(d).toBeHidden();
  await expect(summary(page)).toContainText("Friday");
  await expect(summary(page)).toContainText("14 May 1948");
  await expect(summary(page)).toContainText("5 Iyar 5708");
});

test("validates the Gregorian form and keeps the input", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByLabel("Day").selectOption("31");
  await d.getByLabel("Month").selectOption({ label: "February" });
  await d.getByLabel("Year").fill("2023");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(d).toBeVisible();
  await expect(d.getByText("February 2023 has only 28 days.")).toBeVisible();
  await expect(d.getByLabel("Day")).toHaveAttribute("aria-invalid", "true");

  await d.getByLabel("Year").fill("1800");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(d.getByText("Enter a year between 1900 and 2100.")).toBeVisible();
  await expect(d.getByLabel("Year")).toHaveValue("1800");
});

test("enters a Hebrew date, offering Adar I/II only in leap years", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByRole("radio", { name: "Hebrew" }).check();
  await d.getByLabel("Year").fill("5784");
  const month = d.getByLabel("Month");
  await expect(month.locator("option", { hasText: "Adar II" })).toHaveCount(1);
  await expect(month.locator("option", { hasText: /^Adar$/ })).toHaveCount(0);
  await month.selectOption({ label: "Adar II" });
  await d.getByLabel("Day").selectOption("1");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(summary(page)).toContainText("Monday");
  await expect(summary(page)).toContainText("11 March 2024");
  await expect(summary(page)).toContainText("1 Adar II 5784");
  await expect(summary(page)).toContainText("New moon");
});

test("rejects day 30 of a 29-day Hebrew month", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByRole("radio", { name: "Hebrew" }).check();
  await d.getByLabel("Year").fill("5784");
  await d.getByLabel("Month").selectOption({ label: "Tevet" });
  await d.getByLabel("Day").selectOption("30");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(d.getByText("Tevet 5784 has only 29 days.")).toBeVisible();
});

test("travels through time by day, month and year, and back to today", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Next day" }).click();
  await expect(summary(page)).toContainText("Saturday");
  await expect(summary(page)).toContainText("21 November 2026");
  await page.getByRole("radio", { name: "Month" }).check();
  await page.getByRole("button", { name: "Previous month" }).click();
  await expect(summary(page)).toContainText("21 October 2026");
  await page.getByRole("radio", { name: "Year" }).check();
  await page.getByRole("button", { name: "Previous year" }).click();
  await expect(summary(page)).toContainText("21 October 2025");
  await page.getByRole("button", { name: "Today" }).click();
  await expect(summary(page)).toContainText("Friday");
  await expect(summary(page)).toContainText("20 November 2026");
});

test("dialog: Escape closes it and focus returns to the opener", async ({ page }) => {
  await page.goto("./");
  const opener = page.getByRole("button", { name: "Choose a date" });
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(opener).toBeFocused();
});

test("dates before the 1940 reference date are shown correctly", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByLabel("Day").selectOption("4");
  await d.getByLabel("Month").selectOption({ label: "July" });
  await d.getByLabel("Year").fill("1935");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(summary(page)).toContainText("Thursday");
  await expect(summary(page)).toContainText("4 July 1935");
  await expect(summary(page)).toContainText("3 Tammuz 5695");
});

test("switches to Hebrew with right-to-left layout and remembers the choice", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /Language/ }).click();
  await page.getByRole("option", { name: /עברית/ }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("גלו את יום ההולדת העברי שלכם");
  await expect(page.getByText("10 בכסלו 5787", { exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("button", { name: /שפה: עברית/ })).toBeVisible();
});

test("language picker: dropdown on desktop, full screen on phones; Thai shows the Gregorian year", async ({ page, isMobile }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /Language/ }).click();
  const list = page.getByRole("listbox", { name: "Language" });
  await expect(list.getByRole("option")).toHaveCount(13);
  if (isMobile) {
    await expect(page.getByRole("dialog", { name: "Language" })).toBeVisible();
  } else {
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  // Keyboard: the selected language has focus; Escape closes.
  await expect(list.getByRole("option", { name: /English/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(list).toBeHidden();

  await page.getByRole("button", { name: /Language/ }).click();
  await page.getByRole("option", { name: /ไทย/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  const thaiSummary = page.getByRole("region", { name: "วันที่ที่เลือก" });
  await expect(thaiSummary).toContainText("2026");
  await expect(thaiSummary).not.toContainText("2569"); // not the Buddhist-era year
});

test("every language loads and renders without errors", async ({ page }) => {
  const problems = collectProblems(page);
  for (const code of ["es", "ar", "zh", "ru", "de", "fr", "it", "sr", "he", "yi", "ja", "th", "en"]) {
    await page.goto(`./?lang=${code}`);
    await expect(page.locator("html")).toHaveAttribute("lang", code);
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, code).toBeLessThanOrEqual(0);
  }
  expect(problems).toEqual([]);
});

test("About page opens from the header and links back to the model", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("heading", { level: 1, name: "About Genesis" })).toBeFocused();
  // The creator is presented without a name or links (kept anonymous on purpose).
  const portrait = page.getByRole("img", { name: "Illustrated portrait of the creator" });
  await portrait.scrollIntoViewIfNeeded();
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/Ofra|Dekel/i);
  await page.getByRole("link", { name: "Back to the sky" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Discover your Hebrew birthday" })).toBeVisible();
});

test("tab icon, app icons and manifest all load", async ({ page, request }) => {
  await page.goto("./");
  const hrefs = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]', (links) =>
    links.map((l) => (l as HTMLLinkElement).href),
  );
  expect(hrefs.length).toBeGreaterThanOrEqual(4);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

async function goToDate(page: Page, day: string, month: string, year: string) {
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByLabel("Day").selectOption(day);
  await d.getByLabel("Month").selectOption({ label: month });
  await d.getByLabel("Year").fill(year);
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(d).toBeHidden();
}

test("learn about the Moon phase while travelling through time", async ({ page, isMobile }) => {
  await page.goto("./");
  await goToDate(page, "23", "April", "2024"); // 15 Nisan, full moon, Passover
  await expect(summary(page)).toContainText("Passover");

  await page.getByRole("button", { name: "About Full moon" }).click();
  if (isMobile) {
    const sheet = page.getByRole("dialog", { name: "Full moon" });
    await expect(sheet).toContainText("Passover and Sukkot");
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
  } else {
    const panel = page.getByRole("region", { name: "Full moon" });
    await expect(panel).toContainText("Passover and Sukkot");
    // The explanation stays open and follows the Moon as you step.
    await page.getByRole("radio", { name: "Day" }).check();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Next day" }).click();
    await expect(page.getByRole("region", { name: "Waning gibbous" })).toContainText("same face");
  }
});

test("learn about the Hebrew month", async ({ page }) => {
  await page.goto("./");
  await goToDate(page, "24", "March", "2024"); // 14 Adar II, Purim in a leap year
  await expect(summary(page)).toContainText("Purim");
  await page.getByRole("button", { name: "About Adar II" }).click();
  await expect(page.getByText("In leap years Purim is celebrated on the 14th of Adar II")).toBeVisible();
});

test("quiz: five questions with explanations, a result, and progress that survives a reload", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "Quiz" }).click();
  await expect(page).toHaveURL(/#quiz$/);
  await page.getByRole("button", { name: "Start the quiz" }).click();

  // Answer the first question, then reload: we continue at the same place.
  await expect(page.getByText("Question 1 of 5")).toBeVisible();
  const firstQuestion = await page.getByRole("heading", { level: 1 }).textContent();
  await page.getByRole("group").getByRole("button").first().click();
  await expect(page.getByText(/Correct!|Not quite/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(firstQuestion ?? "");
  await expect(page.getByText(/Correct!|Not quite/)).toBeVisible();

  for (let i = 1; i <= 5; i++) {
    if (i > 1) {
      await expect(page.getByText(`Question ${i} of 5`)).toBeVisible();
      await page.getByRole("group").getByRole("button").first().click();
    }
    await page.getByRole("button", { name: i < 5 ? "Next question" : "See your result" }).click();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Your result" })).toBeVisible();
  await expect(page.getByText(/out of 5/)).toBeVisible();

  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText("Question 1 of 5")).toBeVisible();
});

test("switches between the circle and the horizontal view, and remembers it", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("radio", { name: "Circular" })).toBeChecked();
  await page.getByRole("radio", { name: "Horizontal" }).click(); // the switch is applied after a short morph
  await expect(page.getByRole("radio", { name: "Horizontal" })).toBeChecked();
  const model = page.getByRole("img", { name: /Model of the Sun, Earth and Moon on 20 November 2026/ });
  await expect(model).toBeVisible();
  // Strips are labelled, and stepping a month keeps everything rendering.
  await expect(model.getByText("Kislev").first()).toBeAttached();
  await page.getByRole("radio", { name: "Month" }).check();
  await page.getByRole("button", { name: "Next month" }).click();
  await expect(page.getByRole("img", { name: /20 December 2026/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.reload();
  await expect(page.getByRole("radio", { name: "Horizontal" })).toBeChecked();
});

test("press and hold an arrow to keep travelling; a click moves one step", async ({ page }) => {
  await page.goto("./");
  const next = page.getByRole("button", { name: "Next day" });
  await next.click();
  await expect(summary(page)).toContainText("21 November 2026");

  const box = (await next.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1500); // about 0.4 s delay, then a step every 220 ms
  await page.mouse.up();
  const text = (await summary(page).textContent()) ?? "";
  const day = Number(/(\d+) November 2026/.exec(text)?.[1] ?? /(\d+) December 2026/.exec(text)?.[1]);
  expect(day >= 25 || /December 2026/.test(text)).toBe(true);
});

test("spiral view: history trails behind the Earth and grows as time moves on", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("radio", { name: "Spiral" }).click();
  await expect(page.getByRole("radio", { name: "Spiral" })).toBeChecked();
  const model = page.getByRole("img", { name: /Model of the Sun, Earth and Moon on 20 November 2026/ });
  await expect(model).toBeVisible();
  // Past years are labelled; future ones are not drawn yet.
  await expect(model.getByText("January 2026")).toBeAttached();
  await expect(model.getByText("January 2027")).toHaveCount(0);
  await page.getByRole("radio", { name: "Year" }).check();
  await page.getByRole("button", { name: "Next year" }).click();
  await expect(page.getByRole("img", { name: /20 November 2027/ }).getByText("January 2027")).toBeAttached();
});

test("horizontal view: the leap-month correction shakes the strips and explains itself", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("radio", { name: "Horizontal" }).click();
  await expect(page.getByRole("radio", { name: "Horizontal" })).toBeChecked();
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByLabel("Day").selectOption("6");
  await d.getByLabel("Month").selectOption({ label: "March" });
  await d.getByLabel("Year").fill("2027");
  await d.getByRole("button", { name: "Show date" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Leap year" })).toHaveCount(0);
  await page.getByRole("button", { name: "Next day" }).click(); // 7 March 2027
  await expect(page.getByRole("status").filter({ hasText: "Leap year!" })).toBeVisible();
});

test("circular view: the leap-month correction shakes the circle and explains itself", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Choose a date" }).click();
  const d = dialog(page);
  await d.getByLabel("Day").selectOption("6");
  await d.getByLabel("Month").selectOption({ label: "March" });
  await d.getByLabel("Year").fill("2027");
  await d.getByRole("button", { name: "Show date" }).click();
  await page.getByRole("button", { name: "Next day" }).click(); // 7 March 2027
  await expect(page.getByRole("status").filter({ hasText: "Leap year!" })).toBeVisible();
});

/** A finished 20-question exam with `correct` right answers, saved as the app would save it. */
function finishedExam(correct: number) {
  const question = {
    id: "months-common",
    stem: "quiz.q.monthsCommon",
    params: {},
    options: [12, 10, 11, 13].map((value) => ({ kind: "number", value })),
    answer: 0,
    explain: "quiz.explainDaysShorter",
  };
  return JSON.stringify({
    version: 1,
    certificate: null,
    round: {
      questions: Array.from({ length: 20 }, () => question),
      index: 20,
      answers: Array.from({ length: 20 }, (_, i) => (i < correct ? 0 : 1)),
    },
  });
}

test("certificate: the exam starts from the quiz page", async ({ page }) => {
  await page.goto("./#quiz");
  await page.getByRole("button", { name: "Get a certificate" }).click();
  await expect(page).toHaveURL(/#certificate$/);
  await expect(page.getByRole("heading", { level: 1, name: "Certificate exam" })).toBeVisible();
  await page.getByRole("button", { name: "Start the exam" }).click();
  await expect(page.getByText("Question 1 of 20")).toBeVisible();
});

test("certificate: 12 of 20 is not enough", async ({ page }) => {
  await page.addInitScript((data) => window.localStorage.setItem("genesis.exam", data), finishedExam(12));
  await page.goto("./#certificate");
  await expect(page.getByRole("heading", { level: 1, name: "Almost there!" })).toBeVisible();
  await expect(page.getByText("You need at least 13")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try the exam again" })).toBeVisible();
});

test("certificate: passing leads to card, then name and address, then the certificate to send", async ({ page }) => {
  await page.addInitScript((data) => {
    if (!sessionStorage.getItem("seeded")) {
      window.localStorage.setItem("genesis.exam", data);
      sessionStorage.setItem("seeded", "1");
    }
  }, finishedExam(13));
  await page.goto("./#certificate");
  await expect(page.getByRole("heading", { level: 1, name: "Congratulations, you passed!" })).toBeVisible();
  await expect(page.getByText(/Demo checkout/)).toBeVisible();
  await expect(page.getByText("Step 1 of 3")).toBeVisible();

  // Step 1: card
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("This field is required.").first()).toBeVisible();
  await page.getByLabel("Card number").fill("4242 4242 4242 4241");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Enter a valid card number.")).toBeVisible();
  await page.getByLabel("Card number").fill("4242424242424242");
  await page.getByLabel("Expiry (MM/YY)").fill("1230");
  await page.getByLabel("CVC").fill("123");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 2: name and address
  await expect(page.getByText("Step 2 of 3")).toBeVisible();
  await page.getByLabel("Name on the certificate").fill("Ada Star");
  await page.getByLabel("Address").fill("1 Orbit Lane");
  await page.getByLabel("City").fill("Tel Aviv");
  await page.getByLabel("Postal code").fill("12345");
  await page.getByLabel("Country").fill("Israel");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3: the certificate, then send
  await expect(page.getByText("Step 3 of 3")).toBeVisible();
  const certificate = page.locator("[data-certificate]");
  await expect(certificate).toContainText("Certificate of Achievement");
  await expect(certificate).toContainText("Ada Star");
  await expect(certificate).toContainText("Score: 13 / 20");
  await page.getByRole("button", { name: "Send to 1 Orbit Lane, 12345 Tel Aviv, Israel" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "On its way!" })).toBeVisible();
  await expect(page.getByText("Your certificate will be posted to 1 Orbit Lane, 12345 Tel Aviv, Israel.")).toBeVisible();

  // Card details are never saved; the sent certificate is remembered.
  const saved = await page.evaluate(() => JSON.stringify(window.localStorage));
  expect(saved).not.toContain("4242");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "On its way!" })).toBeVisible();
});

test("certificate: the testing shortcut simulates a passed exam", async ({ page }) => {
  await page.goto("./?test#certificate");
  await page.getByRole("button", { name: /Testing: simulate a passed exam/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Congratulations, you passed!" })).toBeVisible();
  await expect(page.getByText("You answered 14 of 20 questions correctly.")).toBeVisible();
});

test("quiz page: the certificate panel is always visible", async ({ page }) => {
  await page.goto("./#quiz");
  await expect(page.getByRole("button", { name: "Get a certificate" })).toBeVisible();
  await page.getByRole("button", { name: "Start the quiz" }).click();
  await expect(page.getByText("Question 1 of 5")).toBeVisible();
  await expect(page.getByRole("button", { name: "Get a certificate" })).toBeVisible();
});

test("first visit: the next arrow invites a click, and the hint disappears for good once used", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByText("Click to move the Moon")).toBeVisible();
  await page.getByRole("button", { name: "Next day" }).click();
  await expect(page.getByText("Click to move the Moon")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Click to move the Moon")).toHaveCount(0);
});
