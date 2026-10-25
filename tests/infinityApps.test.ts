import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Evaluate catalog data independently of Vite's image imports.
const source = readFileSync(new URL("../src/lib/infinityApps.ts", import.meta.url), "utf8").replace(
  /^import (\w+) from "[^\"]+";$/gm,
  'const $1 = "test-logo";',
);
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const catalogExports: { INFINITY_APPS?: Array<{ id: string; url: string; soon: boolean; telegramHeader?: boolean }> } = {};
new Function("exports", compiled)(catalogExports);

describe("Infinity app availability", () => {
  test("Unacademy Batches opens the supplied portal with the Telegram header cover", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "unacademy-batches")).toMatchObject({ url: "https://nexthope.pages.dev/uncoffline/", soon: false, telegramHeader: true });
  });
  test("Unacademy teacher batches and courses opens the supplied portal with the Telegram header cover", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "unacademy-teachers")).toMatchObject({ url: "https://nexthope.pages.dev/unacademy/", soon: false, telegramHeader: true });
  });
  test("PW opens the supplied site directly without an iframe", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "pw")).toMatchObject({ url: "https://preppronetworkpw.xyz/", soon: false, direct: true });
  });
  test("Vibrant Academy is Coming Soon at the supplied URL", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "vibrant-academy")).toMatchObject({ url: "https://va.eduvibe.cc.cd/", soon: true });
  });
  test("Mission Jeet and Next Topper remain available", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "mission-jeet")?.soon).toBe(false);
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "next-topper")?.soon).toBe(false);
  });
});