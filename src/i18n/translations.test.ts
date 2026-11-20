import { describe, expect, it } from "vitest";
import { LANGUAGES } from "./i18n.ts";

type Tree = { [key: string]: string | Tree };

const files = import.meta.glob<Tree>("./translations/*.json", { eager: true, import: "default" });
const locales = Object.fromEntries(
  Object.entries(files).map(([path, data]) => [path.replace(/^.*\/(\w+)\.json$/, "$1"), data]),
);

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((out, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...out, [path]: value } : { ...out, ...flatten(value, path) };
  }, {});
}

const placeholders = (text: string) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();
const english = flatten(locales.en as Tree);

describe("translations", () => {
  it("exist for every language in the picker", () => {
    expect(Object.keys(locales).sort()).toEqual(LANGUAGES.map((l) => l.code).sort());
  });

  it.each(LANGUAGES.map((l) => l.code))("%s has every key, no extras, and the same placeholders", (code) => {
    const flat = flatten(locales[code] as Tree);
    expect(Object.keys(flat).sort()).toEqual(Object.keys(english).sort());
    for (const [key, text] of Object.entries(english)) {
      expect(flat[key], `${code}: ${key}`).toBeTruthy();
      expect(placeholders(flat[key] ?? ""), `${code}: ${key}`).toEqual(placeholders(text));
    }
  });
});
