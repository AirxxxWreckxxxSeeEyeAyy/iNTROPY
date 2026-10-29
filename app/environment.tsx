"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Sun, ArrowUpRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { months, type Config, type SolarPreview } from "./energy-config";

type SolarData = {
  location: string;
  latitude: number;
  longitude: number;
  period: string;
  retrievedAt: string;
  source: string;
  rows: { month: number; ghi: number; dhi: number }[];
};
type UVData = {
  value: number;
  forecastDate: string;
  distanceKm: number;
  city: string;
  stale: boolean;
  source: string;
};
type SatelliteData = {
  image: string;
  source: string;
  satellite: string;
  observedAt: string;
  credit: string;
  stale: boolean;
};
type CountyRow =
  (typeof import("../public/data/florida-counties.json"))["rows"][number];
type CountyData = {
  rows: CountyRow[];
  year?: number;
  methodology?: string;
  status?: string;
};
type CountyMetric =
  | "residentialKwhPerHousehold"
  | "totalGwh"
  | "averageKw"
  | "residentialCentsPerKwh";
async function readData<T>(response: Response): Promise<T> {
  const value: unknown = await response.json();
  if (!response.ok) {
    const detail =
      value && typeof value === "object" && "error" in value
        ? String(value.error)
        : "Source request failed";
    throw new Error(detail);
  }
  return value as T;
}
const places = [
  ["Tampa", 27.95, -82.46],
  ["St. Petersburg", 27.77, -82.64],
  ["Clearwater", 27.97, -82.8],
  ["Temple Terrace", 28.04, -82.39],
  ["Brandon", 27.94, -82.29],
  ["Zephyrhills", 28.23, -82.18],
] as const;
export function EnvironmentalStudio({
  c,
  setC,
  onApply,
  view = "sun",
}: {
  c: Config;
  setC: React.Dispatch<React.SetStateAction<Config>>;
  onApply: () => void;
  view?: "sun" | "satellite" | "county";
}) {
  const [place, setPlace] = useState(c.radiation?.location || "Tampa"),
    [lat, setLat] = useState(String(c.radiation?.latitude ?? 27.95)),
    [lon, setLon] = useState(String(c.radiation?.longitude ?? -82.46)),
    [month, setMonth] = useState(c.radiation?.month ?? 8),
    [solar, setSolar] = useState<SolarData | null>(null),
    [uv, setUV] = useState<UVData | null>(null),
    [sat, setSat] = useState<SatelliteData | null>(null),
    [loading, setLoading] = useState(view === "sun"),
    [error, setError] = useState(""),
    [uvError, setUVError] = useState(""),
    [satError, setSatError] = useState(""),
    [imgError, setImgError] = useState(false),
    [counties, setCounties] = useState<CountyData | null>(null),
    [selectedCounty, setSelectedCounty] = useState("Hillsborough"),
    [metric, setMetric] = useState<CountyMetric>("residentialKwhPerHousehold");
  const requestId = useRef(0);
  const [startingLocation] = useState(() => ({
    latitude: lat,
    longitude: lon,
    location: place,
  }));
  const load = useCallback(
    async (latitude: string, longitude: string, location: string) => {
      const id = ++requestId.current;
      try {
        const results = await Promise.allSettled([
          fetch(
            `/api/solar?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
          ).then(readData<Omit<SolarData, "location">>),
          fetch(
            `/api/uv?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
          ).then(readData<UVData>),
        ]);
        if (id !== requestId.current) return;
        if (results[0].status === "fulfilled") {
          setSolar({ ...results[0].value, location });
          setError("");
        } else {
          setSolar(null);
          setError(
            results[0].reason instanceof Error
              ? results[0].reason.message
              : "Unable to load sunlight data.",
          );
        }
        if (results[1].status === "fulfilled") {
          setUV(results[1].value);
          setUVError("");
        } else {
          setUV(null);
          setUVError(
            results[1].reason instanceof Error
              ? results[1].reason.message
              : "Unable to load UV data.",
          );
        }
      } catch {
        if (id === requestId.current) setError("Unable to load location data.");
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [],
  );
  function refresh(latitude = lat, longitude = lon, location = place) {
    setLoading(true);
    setError("");
    setUVError("");
    void load(latitude, longitude, location);
  }
  const loadSat = useCallback(async () => {
    try {
      const r = await fetch("/api/satellite");
      const d = await readData<SatelliteData>(r);
      setSatError("");
      setImgError(false);
      setSat(d);
    } catch (e) {
      setSatError(
        e instanceof Error ? e.message : "Unable to load satellite imagery.",
      );
    }
  }, []);
  const invalidateRequests = useCallback(() => {
    requestId.current++;
  }, []);
  useEffect(() => {
    let cancelled = false;
    // Defer client data initialization and cancel an obsolete mount before starting it.
    queueMicrotask(() => {
      if (cancelled) return;
      if (view === "sun")
        void load(
          startingLocation.latitude,
          startingLocation.longitude,
          startingLocation.location,
        );
      if (view === "satellite") void loadSat();
      if (view === "county")
        fetch("/data/florida-counties.json")
          .then(readData<CountyData>)
          .then((d) => {
            if (!cancelled) setCounties(d);
          })
          .catch(() => {
            if (!cancelled)
              setCounties({
                rows: [],
                status: "County data could not be loaded.",
              });
          });
    });
    return () => {
      cancelled = true;
      invalidateRequests();
    };
  }, [view, load, loadSat, startingLocation, invalidateRequests]);
  const resource = solar
    ? {
        ...solar.rows[month],
        latitude: solar.latitude,
        longitude: solar.longitude,
        location: solar.location,
        period: solar.period,
      }
    : null;
  const [preview, setPreview] = useState<SolarPreview | null>(null);
  const [previewKey, setPreviewKey] = useState("");
  const [previewError, setPreviewError] = useState("");
  const requestedPreview = JSON.stringify({
    solar,
    month,
    tilt: c.tilt,
    direction: c.direction,
  });
  useEffect(() => {
    if (!solar) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/solar-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            solar,
            month,
            tilt: c.tilt,
            direction: c.direction,
          }),
          signal: controller.signal,
        });
        const result = await readData<SolarPreview>(response);
        if (!controller.signal.aborted) {
          setPreview(result);
          setPreviewKey(requestedPreview);
          setPreviewError("");
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setPreviewError(
            error instanceof Error
              ? error.message
              : "Solar preview unavailable.",
          );
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [solar, month, c.tilt, c.direction, requestedPreview]);
  const previewPending = !!solar && previewKey !== requestedPreview;
  const poa = previewPending ? null : preview?.poa;
  const allMonths = preview?.allMonths ?? [];
  const options = preview?.options ?? [];
  const best = [...options].sort((a, b) => b.daily - a.daily)[0];
  const rows = (counties?.rows ?? []).filter((r) =>
    ["Hillsborough", "Pinellas", "Pasco", "Manatee"].includes(r.county),
  );
  const chosen = rows.find((x) => x.county === selectedCounty);
  const ranked = [...rows]
    .filter((r) => Number.isFinite(r[metric]))
    .sort((a, b) => b[metric] - a[metric]);
  const displayed = ranked.slice(0, 10);
  if (chosen && !displayed.includes(chosen)) displayed.push(chosen);
  const max = Math.max(1, ...ranked.map((r) => r[metric]));
  const metricLabels: Record<string, string> = {
    residentialKwhPerHousehold: "Residential kWh / household / year",
    totalGwh: "Total electricity · GWh / year",
    averageKw: "Average county demand · kW",
    residentialCentsPerKwh: "Residential average · ¢ / kWh",
  };
  return (
    <main className={`environment-view view-${view}`}>
      <div className="page-head">
        <div>
          <div className="eyebrow">TAMPA BAY · SUN & UV</div>
          <h1>Place the panels. Understand the place.</h1>
          <p>Explore sunlight and UV across Tampa Bay.</p>
        </div>
      </div>
      <section className="location-toolbar panel">
        <div>
          <label htmlFor="region-select">Tampa Bay location</label>
          <Select
            value={place}
            onValueChange={(v) => {
              setPlace(v);
              const p = places.find((p) => p[0] === v);
              if (p) {
                setLat(String(p[1]));
                setLon(String(p[2]));
                refresh(String(p[1]), String(p[2]), v);
              }
            }}
          >
            <SelectTrigger id="region-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {places.map((p) => (
                <SelectItem key={p[0]} value={p[0]}>
                  {p[0]}
                </SelectItem>
              ))}
              <SelectItem value="Custom location">Custom location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label>
          Latitude
          <input
            type="number"
            min="24"
            max="32"
            step="0.001"
            value={lat}
            onChange={(e) => {
              setLat(e.target.value);
              setPlace("Custom location");
            }}
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            min="-88"
            max="-79"
            step="0.001"
            value={lon}
            onChange={(e) => {
              setLon(e.target.value);
              setPlace("Custom location");
            }}
          />
        </label>
        <Button disabled={loading} onClick={() => refresh()}>
          <RefreshCw size={15} />
          {loading ? "Loading sources…" : "Update location"}
        </Button>
      </section>
      <div className="environment-grid">
        <section className="panel content-panel solar-data">
          <div className="eyebrow">NASA POWER · SEASONAL SUNLIGHT</div>
          <div className="env-heading">
            <h2>What reaches the roof?</h2>
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger aria-label="Month">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading || previewPending ? (
            <p role="status">{previewError || "Updating the solar preview…"}</p>
          ) : error ? (
            <div role="alert">
              <p>{error}</p>
              <Button variant="outline" onClick={() => refresh()}>
                Try again
              </Button>
            </div>
          ) : resource && poa ? (
            <>
              <div className="sun-stats">
                <div>
                  <strong>{resource.ghi.toFixed(2)}</strong>
                  <span>kWh/m²/day · horizontal</span>
                </div>
                <div>
                  <strong className="solar">{poa.daily.toFixed(2)}</strong>
                  <span>kWh/m²/day · panel plane estimate</span>
                </div>
              </div>
              <div className="env-controls">
                <label>
                  Panel tilt <strong>{c.tilt}°</strong>
                  <Slider
                    aria-label="Panel tilt"
                    value={[c.tilt]}
                    min={0}
                    max={60}
                    step={5}
                    onValueChange={(v) => setC((p) => ({ ...p, tilt: v[0] }))}
                  />
                </label>
                <div>
                  <label htmlFor="orientation-select">Roof facing</label>
                  <Select
                    value={c.direction}
                    onValueChange={(v) => setC((p) => ({ ...p, direction: v }))}
                  >
                    <SelectTrigger id="orientation-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["North", "South", "East", "West"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div
                className="seasonal-bars"
                role="img"
                aria-label="Monthly modeled panel-plane sunlight in kilowatt-hours per square metre per day"
              >
                {allMonths.map((v, i) => (
                  <button
                    aria-label={`${months[i]}: ${v.toFixed(2)} kWh per square metre per day`}
                    className={i === month ? "active" : ""}
                    onClick={() => setMonth(i)}
                    key={i}
                  >
                    <span>{v.toFixed(1)}</span>
                    <i
                      style={{
                        height: `${(v / Math.max(...allMonths)) * 110}px`,
                      }}
                    />
                    <small>{months[i]}</small>
                  </button>
                ))}
              </div>
              <div className="orientation-comparison">
                {options.map((o) => (
                  <div key={o.direction}>
                    <span>{o.direction}</span>
                    <strong>{o.daily.toFixed(2)}</strong>
                    <small>kWh/m²/day</small>
                  </div>
                ))}
              </div>
              <p className="placement-tip">
                At {c.tilt}°, <strong>{best?.direction.toLowerCase()}</strong>{" "}
                leads these four modeled directions in {months[month]}. Check
                roof structure, shade and afternoon demand before choosing a
                layout.
              </p>
              <Button
                onClick={() => {
                  setC((p) => ({
                    ...p,
                    radiation: resource,
                    sun: resource.ghi,
                  }));
                  onApply();
                }}
              >
                Apply {months[month]} sunlight to home{" "}
                <ArrowUpRight size={15} />
              </Button>
              <p className="fine">
                NASA satellite/model climatology: {solar?.period}. Regional grid
                data, not a roof sensor. Retrieved{" "}
                {solar?.retrievedAt.slice(0, 10)}. The panel-plane and hourly
                values are modeled.
              </p>
              <a
                className="source-link"
                href={solar?.source}
                target="_blank"
                rel="noreferrer"
              >
                NASA source data ↗
              </a>
            </>
          ) : null}
        </section>
        <section className="panel content-panel uv-data">
          <div className="eyebrow">NOAA / EPA · UV FORECAST</div>
          <h2>UV around your area</h2>
          {loading ? (
            <p>Checking the latest bulletin…</p>
          ) : uv ? (
            <>
              <div className="uv-number">
                {uv.value}
                <small>UV index</small>
              </div>
              <p>
                <strong>
                  {uv.value <= 2
                    ? "Low"
                    : uv.value <= 5
                      ? "Moderate"
                      : uv.value <= 7
                        ? "High"
                        : uv.value <= 10
                          ? "Very high"
                          : "Extreme"}
                </strong>{" "}
                at solar noon · {uv.forecastDate}
              </p>
              <p>
                {uv.distanceKm <= 50
                  ? "Nearby forecast city"
                  : "Regional reference city"}
                : <strong>{uv.city}</strong>, approximately {uv.distanceKm} km
                from your coordinates.{" "}
                {uv.distanceKm > 50
                  ? "This is not a forecast at your exact location."
                  : ""}
              </p>
              {uv.stale && (
                <p className="data-warning">
                  The bulletin date has passed. This reading is historical until
                  NOAA updates it.
                </p>
              )}
              <a
                className="source-link"
                href={uv.source}
                target="_blank"
                rel="noreferrer"
              >
                NOAA forecast bulletin ↗
              </a>
            </>
          ) : (
            <p role="status">{uvError || "No UV forecast loaded."}</p>
          )}
          <div className="env-note">
            <Sun size={20} />
            <p>
              UV describes skin-damaging ultraviolet exposure. Solar output uses
              the broader sunlight measurements at left. The UV index never
              multiplies panel output.
            </p>
          </div>
        </section>
        <section className="panel content-panel satellite-panel">
          <div className="env-heading">
            <div>
              <div className="eyebrow">NOAA GOES-EAST · GEOSTATIONARY VIEW</div>
              <h2>Clouds over the Southeast</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSat}
              aria-label="Refresh satellite image"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
          {satError ? (
            <p role="alert">{satError}</p>
          ) : sat ? (
            <>
              <a href={sat.source} target="_blank" rel="noreferrer">
                {imgError ? (
                  <p>Image unavailable. Open the NOAA viewer ↗</p>
                ) : (
                  <Image
                    unoptimized
                    width={1200}
                    height={1200}
                    className="satellite-image"
                    src={sat.image}
                    onError={() => setImgError(true)}
                    alt="NOAA GOES-19 Southeast United States cloud imagery, displayed in grayscale"
                  />
                )}
              </a>
              <p className="fine">
                {sat.satellite} · observed{" "}
                {new Date(sat.observedAt).toUTCString()} · {sat.credit}.
                GeoColor displayed in grayscale.{" "}
                {sat.stale
                  ? "Image is more than three hours old; do not treat it as current."
                  : ""}
              </p>
            </>
          ) : (
            <p>Loading NOAA’s latest image…</p>
          )}
          <p>
            GOES stays over the same region as Earth rotates, revealing cloud
            changes throughout the day. This image gives regional weather
            context; it does not alter your seasonal generation estimate.
          </p>
          <details className="assumptions">
            <summary>What about satellite radiation measurements?</summary>
            <p>
              NOAA’s Downward Shortwave Radiation product estimates direct and
              diffuse sunlight reaching the surface. It is relevant to solar
              forecasting, but this beta does not ingest its numerical grid or
              infer irradiance from image brightness. NASA POWER climatology
              drives the seasonal calculations.
            </p>
            <a
              href="https://www.nesdis.noaa.gov/our-satellites/currently-flying/goes-east-west/goes-r-series-data-products"
              target="_blank"
              rel="noreferrer"
            >
              NOAA radiation products ↗
            </a>
          </details>
        </section>
        <section className="panel content-panel county-panel">
          <div className="eyebrow">TAMPA BAY · COUNTY COMPARISON</div>
          <h2>How electricity use differs</h2>
          {!counties ? (
            <p>Loading county statistics…</p>
          ) : rows.length ? (
            <>
              <div className="county-filters">
                <Select
                  value={selectedCounty}
                  onValueChange={setSelectedCounty}
                >
                  <SelectTrigger aria-label="Tampa Bay county">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rows.map((r) => (
                      <SelectItem key={r.county} value={r.county}>
                        {r.county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={metric}
                  onValueChange={(v) => setMetric(v as CountyMetric)}
                >
                  <SelectTrigger aria-label="County electricity metric">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(metricLabels).map(([k, v]) => (
                      <SelectItem value={k} key={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="fine">
                {counties.year} modeled estimates · {metricLabels[metric]} ·
                four local counties
              </p>
              <div className="county-bars">
                {displayed.map((r) => (
                  <div
                    key={r.county}
                    className={r.county === selectedCounty ? "selected" : ""}
                  >
                    <span>{r.county}</span>
                    <i>
                      <b style={{ width: `${(r[metric] / max) * 100}%` }} />
                    </i>
                    <strong>
                      {Number(r[metric]).toLocaleString("en-US", {
                        maximumFractionDigits:
                          metric === "residentialCentsPerKwh" ? 2 : 0,
                      })}
                    </strong>
                  </div>
                ))}
              </div>
              {chosen && (
                <p>
                  {chosen.county}:{" "}
                  <strong>
                    {chosen.residentialKwhPerHousehold?.toLocaleString(
                      "en-US",
                      { maximumFractionDigits: 0 },
                    )}{" "}
                    kWh
                  </strong>{" "}
                  per household annually; roughly{" "}
                  <strong>
                    {(chosen.residentialKwhPerHousehold / 12).toLocaleString(
                      "en-US",
                      { maximumFractionDigits: 0 },
                    )}{" "}
                    kWh/month
                  </strong>
                  . County averages are context, not a forecast for this home.
                </p>
              )}
            </>
          ) : (
            <p role="status">
              {counties.status ||
                "The county source is temporarily unavailable. No substitute numbers are shown."}
            </p>
          )}
          <details>
            <summary>Understand the units & source</summary>
            <p className="fine">
              kW = power. kWh = energy. Annual kWh ÷ hours in that year =
              average kW, not peak demand. ¢/kWh = average cost per unit, not
              “kilowatts per hour” or a current tariff.
            </p>
            <a
              className="source-link"
              href="https://data.openei.org/submissions/149"
              target="_blank"
              rel="noreferrer"
            >
              NREL / DOE City and County Energy Profiles ↗
            </a>
            {rows.length > 0 && (
              <>
                <p className="fine">
                  {counties?.methodology} Historical cost averages are not
                  applied to your utility worksheet.
                </p>
                <a
                  className="source-link"
                  href="https://michaelminn.net/tutorials/data/2019-county-energy-profiles.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  CSV redistribution & field definitions (Michael Minn) ↗
                </a>
                <br />
                <a
                  className="source-link"
                  href="/data/florida-counties.csv"
                  download
                >
                  Download county statistics (CSV) ↓
                </a>
              </>
            )}
          </details>
        </section>
      </div>
      <details className="assumptions">
        <summary>Methods & source notes</summary>
        <p>
          NASA POWER provides 2001–2020 monthly climatological daily global and
          diffuse horizontal solar energy. iNTROPY uses a representative
          mid-month solar day, a geometric sun position, isotropic sky diffuse
          model, and 0.2 ground reflectance to estimate energy on your panel
          plane. Beam-horizontal energy is distributed using solar elevation.
          Daily totals, not observed hourly irradiance, drive that approximate
          profile. The simulator still includes your shading, 14% system loss,
          battery losses and reserve. Time is approximate local solar time;
          utility tariff alignment, horizon obstructions, module temperature and
          roof geometry require a detailed design. “Best direction” compares
          only the four shown azimuths for the selected month and tilt, not
          installed-system profitability. No UV-to-watts conversion is used.
        </p>
        <a
          href="https://pvpmc.sandia.gov/modeling-guide/1-weather-design-inputs/plane-of-array-poa-irradiance/calculating-poa-irradiance/poa-sky-diffuse/isotropic-sky-diffuse-model/"
          target="_blank"
          rel="noreferrer"
        >
          Sandia PV performance modeling reference ↗
        </a>
      </details>
    </main>
  );
}
