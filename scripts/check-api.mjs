import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const base = new URL(process.argv[2] || "http://localhost:5173");
assert.ok(
  ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname),
  "API checks must target a local test server",
);
const source = ts.transpileModule(
  readFileSync(new URL("../app/energy-config.ts", import.meta.url), "utf8"),
  {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  },
).outputText;
const { initial } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
const post = (path, body, headers = {}) =>
  fetch(new URL(path, base), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
const valid = await post("/api/scenario", initial);
assert.equal(valid.status, 200, "Valid scenario");
assert.equal(valid.headers.get("cache-control"), "no-store");
const data = await valid.json();
assert.equal(data.result.rows.length, 24);
assert.equal(data.solarOnly.discharged, 0);
assert.equal(data.result.base, data.solarOnly.base, "Comparable baseline");
for (const [name, body, status, headers] of [
  ["Out-of-range input", { ...initial, panels: 1000000 }, 400],
  ["Unexpected field", { ...initial, expression: "process.exit()" }, 400],
  [
    "String in numeric field",
    { ...initial, battery: "10;DROP TABLE claims" },
    400,
  ],
  [
    "Prototype key",
    JSON.stringify(initial).replace("{", '{"__proto__":{},'),
    400,
  ],
  ["Malformed JSON", "{bad", 400],
  ["Oversized body", " ".repeat(9000), 413],
  ["Foreign origin", initial, 403, { Origin: "https://untrusted.example" }],
  ["Wrong content type", initial, 415, { "Content-Type": "text/plain" }],
]) {
  const response = await post("/api/scenario", body, headers);
  assert.equal(response.status, status, name);
  const text = await response.text();
  // The framework may reject a foreign origin before the route returns JSON.
  if (status !== 403)
    assert.equal(
      typeof JSON.parse(text).error,
      "string",
      name + " readable error",
    );
  assert.ok(!text.includes("stack"), name + " no stack trace");
}
const solar = {
  latitude: 27.95,
  longitude: -82.46,
  location: "Synthetic test",
  period: "Test fixture",
  retrievedAt: "2026-10-22T00:00:00Z",
  source: "Synthetic fixture; not an observed source",
  rows: Array.from({ length: 12 }, (_, month) => ({ month, ghi: 5, dhi: 1 })),
};
const preview = await post("/api/solar-preview", {
  solar,
  month: 0,
  tilt: 25,
  direction: "South",
});
assert.equal(preview.status, 200);
const output = await preview.json();
assert.equal(output.poa.hourly.length, 24);
assert.equal(output.allMonths.length, 12);
assert.equal(output.options.length, 4);
assert.ok(Number.isFinite(output.poa.daily));
assert.equal(
  (
    await post("/api/solar-preview", {
      solar,
      month: 12,
      tilt: 25,
      direction: "South",
    })
  ).status,
  400,
);
assert.equal(
  (
    await post("/api/scenario", {
      ...initial,
      radiation: {
        ...solar.rows[0],
        latitude: 27.95,
        longitude: -82.46,
        location: "Synthetic",
        period: "Test",
      },
    })
  ).status,
  200,
);
console.log(
  "Local API checks passed: scenario/solar responses, fair baseline, validation, request limits, origin and error handling.",
);
