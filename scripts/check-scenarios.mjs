import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Load the small pure model without requiring a browser or a second TS runner.
const compile = (source) =>
  "data:text/javascript;base64," +
  Buffer.from(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  ).toString("base64");
const stripGuard = (source) =>
  source.replace(/import\s+["']server-only["'];?\s*/g, "");
const config = compile(
  readFileSync(new URL("../app/energy-config.ts", import.meta.url), "utf8"),
);
const solar = compile(
  stripGuard(
    readFileSync(new URL("../app/solar-math.ts", import.meta.url), "utf8"),
  ),
);
const model = stripGuard(
  readFileSync(new URL("../app/model.ts", import.meta.url), "utf8"),
)
  .replace(/(["'])\.\/solar-math\1/g, JSON.stringify(solar))
  .replace(/(["'])\.\/energy-config\1/g, JSON.stringify(config));
const { initial, simulate } = await import(compile(model));
const close = (actual, expected, label) =>
  assert.ok(
    Math.abs(actual - expected) < 1e-8,
    `${label}: ${actual} != ${expected}`,
  );

// Independent hand calculation: 0.35 kW for 24 h at $0.20/kWh = $1.68.
const simple = simulate({
  ...initial,
  panels: 0,
  battery: 0,
  ac: 0,
  dayRate: 20,
  nightRate: 20,
});
close(simple.base, 1.68, "Known utility bill");
close(simple.cost, 1.68, "No equipment equals utility-only cost");
close(simple.dailySolar, 0, "No panels produce no solar");
close(simple.discharged, 0, "No battery supplies no stored energy");

const solarOnly = simulate({ ...initial, battery: 0 });
const withStorage = simulate(initial);
close(
  solarOnly.base,
  withStorage.base,
  "Comparison keeps household load and tariff fixed",
);
close(
  solarOnly.loadTotal,
  withStorage.loadTotal,
  "Comparison keeps energy demand fixed",
);
close(
  solarOnly.dailySolar,
  withStorage.dailySolar,
  "Comparison keeps generation fixed",
);
close(solarOnly.charged, 0, "Solar-only configuration cannot charge a battery");
close(
  solarOnly.discharged,
  0,
  "Solar-only configuration cannot discharge a battery",
);

// A large export credit can make storage less valuable than exporting directly.
const exportScenario = {
  ...initial,
  exportOn: true,
  exportRate: 100,
  dayRate: 1,
  nightRate: 1,
};
assert.ok(
  simulate(exportScenario).cost >
    simulate({ ...exportScenario, battery: 0 }).cost,
  "Comparison must allow storage to raise energy cost relative to solar alone",
);

for (const config of [
  initial,
  { ...initial, battery: 0 },
  { ...initial, panels: 0 },
  exportScenario,
]) {
  const result = simulate(config);
  close(
    result.dailySolar,
    result.direct + result.charged + result.exported + result.curtailed,
    "Solar energy balance",
  );
  close(
    result.loadTotal,
    result.direct +
      result.discharged +
      result.rows.reduce((sum, row) => sum + row.grid, 0),
    "Load energy balance",
  );
  for (const row of result.rows) {
    assert.ok(
      Number.isFinite(row.bill) && row.grid >= -1e-8,
      "Finite charges and nonnegative imports",
    );
    assert.ok(
      row.soc >= (config.battery * config.usable * config.reserve) / 100 - 1e-8,
      "Reserve floor maintained",
    );
    assert.ok(
      row.soc <= config.battery * config.usable + 1e-8,
      "Usable capacity respected",
    );
  }
}
console.log(
  "Scenario checks passed: known bill, fair comparisons, export tradeoff, energy balances and reserve bounds.",
);
