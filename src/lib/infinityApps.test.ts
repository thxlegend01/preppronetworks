import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Evaluate catalog data independently of Vite's image imports.
const source = readFileSync(new URL("./infinityApps.ts", import.meta.url), "utf8").replace(
  /^import (\w+) from "[^\"]+";$/gm,
  'const $1 = "test-logo";',
);
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const catalogExports: { INFINITY_APPS?: Array<{ id: string; url: string; soon: boolean }> } = {};
new Function("exports", compiled)(catalogExports);

describe("Infinity app availability", () => {
  test("PW is available at the supplied batches URL", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "pw")).toMatchObject({ url: "https://pw.eduvibe.cc.cd/batches", soon: false });
  });
  test("Vibrant Academy is available at the supplied URL", () => {
    expect(catalogExports.INFINITY_APPS?.find(app => app.id === "vibrant-academy")).toMatchObject({ url: "https://va.eduvibe.cc.cd/", soon: false });
  });
});