/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Served from the root of its own domain (e.g. Netlify). For GitHub Pages, which serves
  // it from /genesis/, `npm run deploy:github` sets BASE_PATH=/genesis/.
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
