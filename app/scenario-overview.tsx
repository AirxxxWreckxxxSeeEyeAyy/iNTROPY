"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Battery,
  Check,
  Sun,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initial, type Config, type EnergyResult } from "./energy-config";

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

type Props = {
  config: Config;
  result: EnergyResult;
  solarOnly: EnergyResult;
  pending: boolean;
  error: string;
  onSolarOnly: () => void;
  onStorage: () => void;
  onRates: () => void;
  onEquipment: () => void;
  onSunlight: () => void;
  onAdjust: () => void;
};

export function ScenarioOverview({
  config,
  result,
  solarOnly,
  pending,
  error,
  onSolarOnly,
  onStorage,
  onRates,
  onEquipment,
  onSunlight,
  onAdjust,
}: Props) {
  const hasStorage = config.battery > 0;
  const storageDifference = solarOnly.cost - result.cost;
  const saving = result.saved >= 0;
  const sunlight = config.radiation
    ? `${config.radiation.location} · NASA seasonal model`
    : `${config.sun} peak sun hours/day · manual`;

  return (
    <section className="decision-overview" aria-labelledby="scenario-heading">
      <div
        className="scenario-picker"
        role="group"
        aria-label="Choose a scenario"
      >
        <span className="decision-step">01 / CHOOSE A SCENARIO</span>
        <button type="button" aria-pressed={!hasStorage} onClick={onSolarOnly}>
          <Sun size={20} aria-hidden="true" />
          <span>
            Solar only<small>See daytime generation</small>
          </span>
          {!hasStorage && <Check size={16} aria-hidden="true" />}
        </button>
        <button type="button" aria-pressed={hasStorage} onClick={onStorage}>
          <Battery size={20} aria-hidden="true" />
          <span>
            Solar + storage<small>Explore evening energy use</small>
          </span>
          {hasStorage && <Check size={16} aria-hidden="true" />}
        </button>
        <a href="#scenario-inputs" onClick={onAdjust}>
          Adjust your setup <ArrowDown size={15} aria-hidden="true" />
        </a>
      </div>

      <p className="calculation-status" role={error ? "alert" : "status"}>
        {pending
          ? error || "Updating your scenario…"
          : "Results calculated for the inputs below."}
      </p>
      <div className="decision-grid" aria-busy={pending}>
        <div className="decision-results panel">
          <div className="decision-title">
            <div>
              <span className="decision-step">02 / COMPARE THE OUTCOME</span>
              <h2 id="scenario-heading">Your illustrative day</h2>
            </div>
            <span className="estimate-tag">Modeled estimate</span>
          </div>
          <div className="decision-metrics" aria-hidden={pending}>
            <div className="decision-metric primary-metric">
              <span>Estimated energy cost</span>
              <strong>
                {money(result.cost)}
                <small>/day</small>
              </strong>
              <p>Utility only: {money(result.base)}/day</p>
              <span
                className={saving ? "change-value" : "change-value increase"}
              >
                {money(Math.abs(result.saved))} {saving ? "lower" : "higher"}{" "}
                per modeled day
              </span>
            </div>
            <div className="decision-metric">
              <span>Daily demand served by solar</span>
              <strong>
                {Math.round(result.offset)}
                <small>%</small>
              </strong>
              <p>{result.dailySolar.toFixed(1)} kWh generated</p>
              <span className="metric-detail">Direct solar + stored solar</span>
            </div>
            <div className="decision-metric">
              <span>Modeled night load covered</span>
              <strong>
                {Math.round(result.nightCoverage)}
                <small>%</small>
              </strong>
              <p>{result.discharged.toFixed(1)} kWh from storage</p>
              <span className="metric-detail">
                Above your {config.reserve}% reserve
              </span>
            </div>
          </div>

          <div className="scenario-comparison" aria-hidden={pending}>
            <h3>Compare the same home and rates</h3>
            <div className="comparison-table-scroll">
              <table>
                <caption className="sr-only">
                  Daily energy charges for the current inputs. Equipment and
                  installation costs are excluded.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Configuration</th>
                    <th scope="col">Storage</th>
                    <th scope="col">Energy cost/day</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Utility only</th>
                    <td>None</td>
                    <td>{money(result.base)}</td>
                  </tr>
                  <tr
                    className={!hasStorage ? "current-comparison" : undefined}
                  >
                    <th scope="row">
                      Solar only{!hasStorage && <small>Current</small>}
                    </th>
                    <td>None</td>
                    <td>{money(solarOnly.cost)}</td>
                  </tr>
                  {hasStorage && (
                    <tr className="current-comparison">
                      <th scope="row">
                        Solar + storage<small>Current</small>
                      </th>
                      <td>{config.battery.toLocaleString()} kWh</td>
                      <td>{money(result.cost)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="comparison-note">
              {hasStorage
                ? `Adding this storage changes modeled energy charges by ${money(Math.abs(storageDifference))}/day ${storageDifference >= 0 ? "lower" : "higher"} than solar alone. `
                : `Choose solar + storage to compare a ${initial.battery} kWh reference battery. `}
              Energy charges only; no equipment, installation, financing, fixed
              fees or taxes. This is not an investment return.
            </p>
          </div>
          <div className="decision-actions">
            <Button onClick={onEquipment}>
              Compare equipment <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
            <a href="#installer-review">
              Prepare for an installer{" "}
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <aside
          className="decision-assumptions panel"
          aria-labelledby="assumptions-heading"
        >
          <span className="decision-step">03 / CHECK THE ASSUMPTIONS</span>
          <h2 id="assumptions-heading">What drives these numbers?</h2>
          <dl>
            <div>
              <dt>Solar array</dt>
              <dd>
                {config.panels} × {config.watts} W
                <small>
                  {((config.panels * config.watts) / 1000).toFixed(2)} kW
                  nameplate
                </small>
              </dd>
            </div>
            <div>
              <dt>Roof & shade</dt>
              <dd>
                {config.direction} · {config.shade}% shade
              </dd>
            </div>
            <div>
              <dt>Sunlight</dt>
              <dd>{sunlight}</dd>
            </div>
            <div>
              <dt>Import rates</dt>
              <dd>
                {config.dayRate}¢ day / {config.nightRate}¢ night
                <small>
                  {config.dayRate === initial.dayRate &&
                  config.nightRate === initial.nightRate
                    ? "Default example inputs; not a verified tariff"
                    : "Entered scenario inputs; verify against your tariff"}
                </small>
              </dd>
            </div>
            <div>
              <dt>Export credit</dt>
              <dd>
                {config.exportOn
                  ? `${config.exportRate}¢/kWh · enabled`
                  : "Off · surplus not credited"}
              </dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>
                {hasStorage
                  ? `${config.battery} kWh · ${Math.round(config.efficiency * 100)}% round-trip`
                  : "No battery selected"}
                <small>
                  {hasStorage
                    ? `${Math.round(config.usable * 100)}% usable · ${config.reserve}% reserve`
                    : "Evening demand is served by the grid"}
                </small>
              </dd>
            </div>
          </dl>
          <div className="assumption-actions">
            <button type="button" onClick={onRates}>
              Edit rates <ArrowUpRight size={14} aria-hidden="true" />
            </button>
            <button type="button" onClick={onSunlight}>
              Review sunlight <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          </div>
          <p>
            One illustrative day, not a site survey, live bill or guaranteed
            saving. Change the inputs and review the detailed model below.
          </p>
        </aside>
      </div>
      <div className="energy-section-heading">
        <div>
          <span className="decision-step">04 / FOLLOW THE ENERGY</span>
          <h2>See how your scenario works.</h2>
        </div>
        <span>
          <Sun size={15} aria-hidden="true" /> Generate{" "}
          <ArrowUpRight size={13} aria-hidden="true" />{" "}
          <Battery size={15} aria-hidden="true" /> Store{" "}
          <ArrowUpRight size={13} aria-hidden="true" />{" "}
          <Zap size={15} aria-hidden="true" /> Use
        </span>
      </div>
    </section>
  );
}
