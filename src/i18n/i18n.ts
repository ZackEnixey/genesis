import i18n, { type BackendModule, type ResourceKey } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";

/** Supported languages, in the order they appear in the language picker. */
export const LANGUAGES = [
  { code: "en", nativeName: "English", dir: "ltr" },
  { code: "es", nativeName: "Español", dir: "ltr" },
  { code: "ar", nativeName: "العربية", dir: "rtl" },
  { code: "zh", nativeName: "中文", dir: "ltr" },
  { code: "ru", nativeName: "Русский", dir: "ltr" },
  { code: "de", nativeName: "Deutsch", dir: "ltr" },
  { code: "fr", nativeName: "Français", dir: "ltr" },
  { code: "it", nativeName: "Italiano", dir: "ltr" },
  { code: "sr", nativeName: "Srpski", dir: "ltr" },
  { code: "he", nativeName: "עברית", dir: "rtl" },
  { code: "yi", nativeName: "ייִדיש", dir: "rtl" },
  { code: "ja", nativeName: "日本語", dir: "ltr" },
  { code: "th", nativeName: "ไทย", dir: "ltr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/** Languages written in Hebrew script, they don't need the extra Hebrew labels on the rings. */
export const HEBREW_SCRIPT_LANGUAGES: ReadonlySet<string> = new Set(["he", "yi"]);

export function resolveLanguage(code: string | undefined): LanguageCode {
  const base = (code ?? "en").toLowerCase().split("-")[0];
  return LANGUAGES.find((l) => l.code === base)?.code ?? "en";
}

function applyDocumentLanguage(code: string) {
  const language = LANGUAGES.find((l) => l.code === resolveLanguage(code)) ?? LANGUAGES[0];
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.dir;
}

/*
 * English is bundled (it is also the fallback). Every other language is a separate
 * ~3-5 KB file that is downloaded only when someone chooses it.
 */
const lazyLocales = import.meta.glob<{ default: ResourceKey }>(["./translations/*.json", "!./translations/en.json"]);

const lazyBackend: BackendModule = {
  type: "backend",
  init() {},
  read(language, _namespace, callback) {
    const load = lazyLocales[`./translations/${language}.json`];
    if (!load) {
      callback(null, {}); // unknown or bundled language: nothing to fetch
      return;
    }
    load()
      .then((module) => callback(null, module.default))
      .catch((error: unknown) => {
        console.error(`Could not load the "${language}" translations.`, error);
        callback(error instanceof Error ? error : new Error(String(error)), false);
      });
  },
};

i18n.on("languageChanged", applyDocumentLanguage);

/** Resolves once the detected language has been loaded. */
export const i18nReady = i18n
  .use(lazyBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    fallbackLng: "en",
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false }, // React already escapes output.
    react: { useSuspense: false },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
    returnNull: false,
  });

export default i18n;
