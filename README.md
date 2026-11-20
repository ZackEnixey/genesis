# Genesis

**Discover your Hebrew birthday and see how the Moon looked on the day you were born.**

Genesis is an interactive model of the Sun, Earth and Moon. Pick any date between 1900 and 2100, in the Gregorian or the Hebrew calendar, and the model turns to that day. It shows:

- the date in both calendars,
- where the Earth is in its orbit against the seasons and the Hebrew months,
- the Moon's position around the Earth and its phase.

Live: https://ZackEnixey.github.io/genesis

## Features

- **Two calendars.** Enter a Gregorian or a Hebrew date. Hebrew dates are validated: Adar I/II appear only in leap years, and 29-day months have no day 30.
- **Time travel.** Step by day, month or year and watch the model animate. "Today" brings you back.
- **Moon phase.** An accurate phase drawing and name for every day of the Hebrew month.
- **Hand-built vector graphics.** The Sun, Earth, Moon and calendar rings are drawn in SVG, with no raster images.
  - The rings are localised and the Hebrew months share the seasons' colours.
  - The Earth is drawn from Natural Earth map data as seen from above the North Pole.
- **Living sky.** A procedural starfield with twinkling stars and a Milky Way. Its three depth layers turn with the Earth's orbit as you travel through time.
- **Learn as you go.** Tap ⓘ next to the Moon phase or the Hebrew month for short, kid-friendly facts. On larger screens the explanation stays open and updates while you travel through time.
- **Festivals.** A badge shows when the selected day is Rosh Chodesh, Rosh Hashanah, Yom Kippur, Sukkot, Hanukkah, Tu BiShvat, Purim, Passover, Lag BaOmer, Shavuot or Tu B'Av.
- **13 languages.** English, Español, العربية, 中文, Русский, Deutsch, Français, Italiano, Srpski, עברית, ייִדיש, 日本語 and ไทย, with right-to-left layouts where needed. Only the chosen language is downloaded, and the choice is remembered.
- **Three views of time.** *Circular* (the classic model), *Horizontal* (the rings unrolled into endless strips, with a big Earth and the Moon on its orbit; the strips shake when the leap month pulls the Hebrew months back) and *Spiral* (the Earth's path around the moving Sun, with the history of months trailing behind). Switching morphs smoothly between them.
- **Quiz.** Rounds of five questions from a bank of 48 about Hebrew months, festivals, leap years and the Moon. Progress is saved (`#quiz`).
- **About page.** A short story of the game and its creator (`#about`).
- **Responsive.** Two-column layout on desktop, single column with a bottom toolbar on phones.
- **Accessible.**
  - Semantic landmarks and a native modal dialog with focus management and Escape to close.
  - Labelled controls, errors announced to screen readers, and visible focus.
  - 44px touch targets, and respects `prefers-reduced-motion`.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript (strict) |
| Build | Vite 8 |
| Styling | CSS Modules + design tokens (`src/styles/tokens.css`) |
| i18n | i18next / react-i18next |
| Icons | lucide-react |
| Tests | Vitest + Testing Library (unit/component), Playwright (end-to-end) |

There is no backend and no network call at runtime.

## Getting started

Requires Node.js 22.18 or newer.

```bash
npm install
npm start          # opens http://localhost:5173/
```

| Script | Purpose |
| --- | --- |
| `npm start` | Development server, opens the app in your browser |
| `npm run dev` | Development server (without opening the browser) |
| `npm run build` | Type-check and production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check |
| `npm test` | Unit and component tests |
| `npm run test:e2e` | Playwright tests on desktop and mobile viewports (uses your installed Chrome) |
| `npm run verify:hebrew` | Cross-checks the calendar conversion against hebcal.com (needs network) |
| `npm run deploy` | Build and publish to GitHub Pages |

## Project structure

```
src/
  lib/            Pure, tested logic, no React
    gregorian.ts    calendar-day arithmetic (UTC day numbers, time-zone safe)
    hebrew.ts       Hebrew ↔ Gregorian conversion
    simulation.ts   Sun-Earth-Moon geometry for a given day
    moonPhasePath.ts SVG path of the lit part of the Moon
  state/          SimulationContext, the selected day and animation timing
  components/
    ui/             Button, SegmentedControl, Field, Dialog, Card
    simulation/     SolarSystem (the model), Sun, Earth, MoonBody, CalendarRings, MoonPhase
                    earthLand.ts is generated from Natural Earth (public domain)
    panels/         DateSummary, TimeStepper, DateDialog + forms
    layout/         AppHeader, Logo, Starfield, ErrorBoundary
  i18n/           i18next setup, locale-aware formatting, translations
  styles/         tokens.css (design tokens), global.css
e2e/              Playwright tests
scripts/          verify-hebrew-conversion.mjs, build-earth-outline.mjs
```

## How the calendar conversion stays accurate

- **Gregorian → Hebrew** uses the browser's built-in Hebrew calendar (`Intl`, backed by ICU). It implements the standard arithmetic Hebrew calendar.
- **Hebrew → Gregorian** is derived from it exactly. The code finds the year's Rosh Hashanah and walks its months. It reads only the numeric year and day from `Intl`, never month names, which differ between browser versions.

`npm run verify:hebrew` compares every day from 1900 to 2100 (73,414 days) with Hebcal in both directions. The last run reported **0 mismatches**. The unit tests also check an exact round trip for every day in that range.

## Simulation model

The geometry and constants come from the original 2022 version. Characterisation tests (`src/lib/simulation.test.ts`) assert that the new code reproduces the original formulas. Two deliberate fixes:

- **Angles come from the date alone.** The old Moon accumulated extra turns on every re-render.
- **Dates before the 11 March 1940 reference date work.** They were previously mirrored to a date after 1940.
