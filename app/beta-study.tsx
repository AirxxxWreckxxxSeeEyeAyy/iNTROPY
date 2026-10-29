"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
type Metric = {
  id: string;
  label: string;
  touches: number;
  misses: number;
  hoverMs: number;
  hovers: number;
  speed: number;
  speedSamples: number;
  grid: number[];
};
type Session = {
  id: string;
  revision: string;
  metrics: Record<string, Metric>;
};
const revision = "Color grading and theme revision";
const key = "intropy-beta-color-v1";
export function BetaStudy() {
  const [active, setActive] = useState(false),
    [sessions, setSessions] = useState<Session[]>([]),
    [pending, setPending] = useState<{
      id: string;
      label: string;
      cell: number;
    } | null>(null),
    [haptic, setHaptic] = useState(false),
    [supported, setSupported] = useState(false),
    [depth, setDepth] = useState(false),
    [message, setMessage] = useState("");
  const current = useRef<Session | null>(null),
    near = useRef<{
      id: string;
      label: string;
      cell: number;
      time: number;
    } | null>(null);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSupported(typeof navigator.vibrate === "function");
      try {
        const a: unknown = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(a)) setSessions(a.filter(validSession));
      } catch {}
    });
    return () => {
      cancelled = true;
    };
  }, []);
  function save(next: Session[]) {
    setSessions(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setMessage("Device storage unavailable; export before leaving.");
    }
  }
  function record(id: string, label: string, patch: (m: Metric) => void) {
    const s = current.current;
    if (!s) return;
    const m = s.metrics[id] ?? {
      id,
      label,
      touches: 0,
      misses: 0,
      hoverMs: 0,
      hovers: 0,
      speed: 0,
      speedSamples: 0,
      grid: Array(9).fill(0),
    };
    patch(m);
    s.metrics[id] = m;
    setSessions((prev) => {
      const next = [
        ...prev.filter((x) => x.id !== s.id),
        JSON.parse(JSON.stringify(s)),
      ];
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function start() {
    current.current = { id: crypto.randomUUID(), revision, metrics: {} };
    setPending(null);
    near.current = null;
    setActive(true);
    setMessage(
      "Recording this tester on this device. Try the model tools and categories.",
    );
  }
  useEffect(() => {
    if (!active) return;
    const hovers = new Map<string, number>();
    let down: { x: number; y: number; time: number } | null = null;
    const target = (e: Event) =>
      e.target instanceof Element
        ? e.target.closest<HTMLElement>("[data-study]")
        : null;
    const enter = (e: PointerEvent) => {
      const el = target(e);
      if (
        e.pointerType === "mouse" &&
        el &&
        !el.contains(e.relatedTarget as Node)
      )
        hovers.set(el.dataset.study!, performance.now());
    };
    const leave = (e: PointerEvent) => {
      const el = target(e);
      if (!el || el.contains(e.relatedTarget as Node)) return;
      const t = hovers.get(el.dataset.study!);
      if (t !== undefined) {
        const ms = Math.min(60000, performance.now() - t);
        record(
          el.dataset.study!,
          el.getAttribute("aria-label") ||
            el.textContent?.trim() ||
            el.dataset.study!,
          (m) => {
            m.hoverMs += ms;
            m.hovers++;
          },
        );
        hovers.delete(el.dataset.study!);
      }
    };
    const press = (e: PointerEvent) => {
      if (e.pointerType === "touch")
        down = { x: e.clientX, y: e.clientY, time: performance.now() };
    };
    const release = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !down) return;
      const time = performance.now(),
        distance = Math.hypot(e.clientX - down.x, e.clientY - down.y),
        duration = Math.max(1, time - down.time);
      down = null;
      if (distance > 24 || duration > 1200) return;
      const el = target(e);
      if (el) {
        const id = el.dataset.study!,
          label = el.getAttribute("aria-label") || el.textContent?.trim() || id;
        if (near.current?.id === id && time - near.current.time < 1800)
          setPending(near.current);
        near.current = null;
        record(id, label, (m) => {
          m.touches++;
          m.speed += (distance / duration) * 1000;
          m.speedSamples++;
        });
        if (haptic && navigator.vibrate) navigator.vibrate(12);
        return;
      }
      let closest: { el: HTMLElement; dist: number; cell: number } | null =
        null;
      document.querySelectorAll<HTMLElement>("[data-study]").forEach((node) => {
        const b = node.getBoundingClientRect();
        if (!b.width || !b.height) return;
        const dx = Math.max(b.left - e.clientX, 0, e.clientX - b.right),
          dy = Math.max(b.top - e.clientY, 0, e.clientY - b.bottom),
          dist = Math.hypot(dx, dy);
        if (dist > 0 && dist <= 28 && (!closest || dist < closest.dist)) {
          const col = e.clientX < b.left ? 0 : e.clientX > b.right ? 2 : 1,
            row = e.clientY < b.top ? 0 : e.clientY > b.bottom ? 2 : 1;
          closest = { el: node, dist, cell: row * 3 + col };
        }
      });
      const hit = closest as {
        el: HTMLElement;
        dist: number;
        cell: number;
      } | null;
      if (hit)
        near.current = {
          id: hit.el.dataset.study!,
          label:
            hit.el.getAttribute("aria-label") ||
            hit.el.textContent?.trim() ||
            "Control",
          cell: hit.cell,
          time,
        };
      else near.current = null;
    };
    document.addEventListener("pointerover", enter);
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    return () => {
      document.removeEventListener("pointerover", enter);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
    };
  }, [active, haptic]);
  useEffect(() => {
    document.documentElement.classList.toggle("depth-preview", depth);
    return () => document.documentElement.classList.remove("depth-preview");
  }, [depth]);
  const ids = Array.from(
    new Set(sessions.flatMap((s) => Object.keys(s.metrics))),
  );
  function exportData() {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "intropy-color-grading-beta.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function importData(file?: File) {
    if (!file) return;
    if (file.size > 2000000) {
      setMessage("File is too large.");
      return;
    }
    try {
      const incoming = JSON.parse(await file.text());
      if (
        !Array.isArray(incoming) ||
        incoming.length > 1000 ||
        !incoming.every(validSession)
      )
        throw Error();
      const combined = new Map(sessions.map((s) => [s.id, s]));
      incoming.forEach((s) => combined.set(s.id, s));
      save([...combined.values()]);
      setMessage("Tester sessions combined; repeated IDs were counted once.");
    } catch {
      setMessage("Choose a valid iNTROPY beta export.");
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="beta-launch">
            Beta feedback{active ? " · recording" : ""}
          </Button>
        </DialogTrigger>
        <DialogContent className="beta-dialog">
          <DialogTitle>Learn from each test.</DialogTitle>
          <DialogDescription>{revision}</DialogDescription>
          <p>
            Opt in to measure hover duration, touch movement speed and confirmed
            missed taps on category and model buttons. Only anonymous summaries
            stay on this device. Nothing is uploaded automatically.
          </p>
          <div className="beta-actions">
            <Button onClick={start}>
              {active ? "Start next tester" : "Start a tester session"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setActive(false);
                setPending(null);
                near.current = null;
                setMessage("Recording stopped.");
              }}
              disabled={!active}
            >
              Stop recording
            </Button>
            <Button
              variant="outline"
              onClick={exportData}
              disabled={!sessions.length}
            >
              Export results
            </Button>
          </div>
          <label className="study-check">
            <input
              type="checkbox"
              checked={haptic}
              disabled={!supported}
              onChange={(e) => setHaptic(e.target.checked)}
            />{" "}
            Optional touch vibration{" "}
            {supported
              ? "(if permitted by device)"
              : "— unavailable on this browser"}
          </label>
          <label className="study-check">
            <input
              type="checkbox"
              checked={depth}
              onChange={(e) => setDepth(e.target.checked)}
            />{" "}
            Preview raised, 3D-gradient model icons
          </label>
          <details>
            <summary>Review icons · {sessions.length} tester sessions</summary>
            <p>
              Review threshold: at least 65% of touch-test sessions for an icon
              report a confirmed miss, with at least 20 sessions. A session
              represents a tester only when a facilitator starts one per person.
              Hover data is separate. This threshold is your review rule, not
              statistical proof.
            </p>
            {!ids.length && <p>No test results yet.</p>}
            {ids.map((id) => {
              const records = sessions
                  .map((s) => s.metrics[id])
                  .filter(Boolean),
                touched = records.filter((m) => m.touches > 0),
                missed = touched.filter((m) => m.misses > 0),
                rate = touched.length ? missed.length / touched.length : 0,
                flag = touched.length >= 20 && rate >= 0.65;
              const grid = Array.from({ length: 9 }, (_, i) =>
                  records.reduce((sum, m) => sum + m.grid[i], 0),
                ),
                hs = records.reduce((sum, m) => sum + m.hovers, 0),
                ss = records.reduce((sum, m) => sum + m.speedSamples, 0);
              return (
                <article className="study-result" key={id}>
                  <h3>{records[0].label}</h3>
                  <p>
                    {missed.length}/{touched.length} touch-test sessions with
                    confirmed misses ({Math.round(rate * 100)}%).{" "}
                    <strong>
                      {flag
                        ? "Review hit area, spacing, optional haptics and 3D gradient."
                        : touched.length < 20
                          ? "Collect more sessions."
                          : "Below review threshold."}
                    </strong>
                  </p>
                  <div
                    className="touch-matrix"
                    aria-label="3 by 3 confirmed near-miss locations around the control"
                  >
                    {grid.map((n, i) => (
                      <span
                        key={i}
                        title={
                          [
                            "Upper left",
                            "Above",
                            "Upper right",
                            "Left",
                            "Target",
                            "Right",
                            "Lower left",
                            "Below",
                            "Lower right",
                          ][i]
                        }
                        style={{
                          opacity: n
                            ? Math.max(0.45, n / Math.max(1, ...grid))
                            : 1,
                        }}
                      >
                        {i === 4 ? "icon" : n}
                      </span>
                    ))}
                  </div>
                  <small>
                    Mean hover:{" "}
                    {hs
                      ? (
                          records.reduce((s, m) => s + m.hoverMs, 0) /
                          hs /
                          1000
                        ).toFixed(2)
                      : "—"}{" "}
                    s · Mean finger movement during tap:{" "}
                    {ss
                      ? (records.reduce((s, m) => s + m.speed, 0) / ss).toFixed(
                          0,
                        )
                      : "—"}{" "}
                    px/s
                  </small>
                </article>
              );
            })}
            <label className="import-label">
              Combine exports from other testers
              <input
                type="file"
                accept="application/json"
                onChange={(e) => void importData(e.target.files?.[0])}
              />
            </label>
            <Button
              variant="outline"
              onClick={() => {
                setActive(false);
                setPending(null);
                current.current = null;
                save([]);
                setMessage("Local test records cleared.");
              }}
            >
              Clear local records
            </Button>
          </details>
          <p role="status">{message}</p>
          <details>
            <summary>How a missed tap is detected</summary>
            <p>
              A touch ending within 28 CSS pixels outside a tracked button,
              followed by a tap on that button within 1.8 seconds, raises a
              question. Only “Yes” counts as a confirmed miss. Scroll gestures
              and long presses are excluded. Finger speed is measured during
              contact; approach speed and intent cannot be inferred. This does
              not detect hardware ghost touches. Start a new session for each
              tester. No screen recordings, text input, names or continuous
              movement logs are stored.
            </p>
          </details>
        </DialogContent>
      </Dialog>
      {active && (
        <div className="recording-pill" role="status">
          Beta study recording{" "}
          <button
            onClick={() => {
              setActive(false);
              setPending(null);
            }}
          >
            Stop
          </button>
        </div>
      )}
      {pending && active && (
        <div
          className="miss-prompt"
          role="dialog"
          aria-label="Confirm intended control"
        >
          <p>Were you trying to tap “{pending.label}” just before that?</p>
          <Button
            onClick={() => {
              record(pending.id, pending.label, (m) => {
                m.misses++;
                m.grid[pending.cell]++;
              });
              setPending(null);
            }}
          >
            Yes, I missed it
          </Button>
          <Button variant="outline" onClick={() => setPending(null)}>
            No
          </Button>
        </div>
      )}
    </>
  );
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function validSession(s: unknown): s is Session {
  if (
    !isRecord(s) ||
    typeof s.id !== "string" ||
    s.id.length >= 100 ||
    s.revision !== revision ||
    !isRecord(s.metrics) ||
    Object.keys(s.metrics).length > 100
  )
    return false;
  return Object.values(s.metrics).every(
    (m) =>
      isRecord(m) &&
      typeof m.id === "string" &&
      typeof m.label === "string" &&
      m.label.length < 200 &&
      ["touches", "misses", "hoverMs", "hovers", "speed", "speedSamples"].every(
        (k) => typeof m[k] === "number" && Number.isFinite(m[k]) && m[k] >= 0,
      ) &&
      Array.isArray(m.grid) &&
      m.grid.length === 9 &&
      m.grid.every(
        (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0,
      ),
  );
}
