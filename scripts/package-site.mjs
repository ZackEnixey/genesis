/**
 * Packs the built site (dist/) into genesis-website.zip, ready to drag and drop onto
 * a static host such as Netlify Drop. Run with: npm run package
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const zip = path.join(root, "genesis-website.zip");

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(1);
}
fs.rmSync(zip, { force: true });

// bsdtar (built into Windows 10+ and macOS) writes a .zip when the name ends in .zip.
// On Windows, use the system copy explicitly (Git Bash ships a different tar).
const windowsTar = path.join(process.env.SystemRoot ?? "C:/Windows", "System32", "tar.exe");
const tar = process.platform === "win32" && fs.existsSync(windowsTar) ? windowsTar : "tar";

try {
  // List the entries (rather than ".") so paths in the zip have no "./" prefix.
  execFileSync(tar, ["-a", "-c", "-f", zip, "-C", dist, ...fs.readdirSync(dist)], { stdio: "inherit" });
  const kb = Math.round(fs.statSync(zip).size / 1024);
  console.log(`\nCreated ${path.basename(zip)} (${kb} KB). Drag it onto https://app.netlify.com/drop`);
} catch {
  console.log("\nCould not create a zip here. Drag the dist folder itself onto https://app.netlify.com/drop instead.");
}
