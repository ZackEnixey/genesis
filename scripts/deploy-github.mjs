/**
 * Optional: publishes the site to GitHub Pages (served from /genesis/).
 * Run with: npm run deploy:github
 */
import { execSync } from "node:child_process";

execSync("npm run build", { stdio: "inherit", env: { ...process.env, BASE_PATH: "/genesis/" } });
execSync("npx gh-pages -d dist", { stdio: "inherit" });
