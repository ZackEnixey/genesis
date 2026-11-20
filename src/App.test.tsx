import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import App from "./App.tsx";
import i18n from "./i18n/i18n.ts";
import { toDayNumber } from "./lib/gregorian.ts";
import { SimulationProvider } from "./state/SimulationContext.tsx";

function renderApp() {
  return render(
    <SimulationProvider initialDay={toDayNumber({ year: 2024, month: 4, day: 23 })}>
      <App />
    </SimulationProvider>,
  );
}

describe("App", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows the selected date in both calendars with the Moon phase", () => {
    renderApp();
    const summary = screen.getByRole("region", { name: "Selected date" });
    expect(within(summary).getByText("Tuesday")).toBeInTheDocument();
    expect(within(summary).getByText("23 April 2024")).toBeInTheDocument();
    expect(within(summary).getByText("15 Nisan 5784")).toBeInTheDocument();
    expect(within(summary).getByText("Full moon")).toBeInTheDocument();
  });

  it("steps forward and backward through time", async () => {
    const user = userEvent.setup();
    renderApp();
    const summary = screen.getByRole("region", { name: "Selected date" });

    await user.click(screen.getByRole("button", { name: "Next day" }));
    expect(within(summary).getByText("Wednesday")).toBeInTheDocument();
    expect(within(summary).getByText("24 April 2024")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Year" }));
    await user.click(screen.getByRole("button", { name: "Previous year" }));
    expect(within(summary).getByText("Monday")).toBeInTheDocument();
    expect(within(summary).getByText("24 April 2023")).toBeInTheDocument();
  });

  it("exposes an accessible description of the model", () => {
    renderApp();
    expect(screen.getByRole("img", { name: /Model of the Sun, Earth and Moon on 23 April 2024: Full moon/ })).toBeInTheDocument();
  });
});
