import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { i18nReady } from "./i18n/i18n.ts";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/layout/ErrorBoundary.tsx";
import { SimulationProvider } from "./state/SimulationContext.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found.");

// Render once the visitor's language is loaded (English is instant; others are a few KB).
// If it fails to load, i18next falls back to English and the app still renders.
void i18nReady.finally(() => {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
