import "server-only";
import type { Radiation } from "./energy-config";
const rad = (x: number) => (x * Math.PI) / 180;
// Representative mid-month solar day; isotropic sky + 0.2 ground reflectance.
// Daily beam-horizontal energy is distributed in proportion to cos(zenith).
// This is a planning approximation, not an hourly satellite observation.
export function planeIrradiance(r: Radiation, tilt: number, direction: string) {
  const day = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344][
    r.month
  ];
  const dec = rad(23.45 * Math.sin((2 * Math.PI * (284 + day)) / 365)),
    lat = rad(r.latitude),
    beta = rad(tilt),
    az = rad(
      ({ North: 0, East: 90, South: 180, West: 270 } as Record<string, number>)[
        direction
      ] ?? 180,
    );
  const samples = Array.from({ length: 96 }, (_, i) => {
    const h = rad(15 * ((i + 0.5) / 4 - 12));
    const z =
      Math.sin(lat) * Math.sin(dec) +
      Math.cos(lat) * Math.cos(dec) * Math.cos(h);
    const east = -Math.cos(dec) * Math.sin(h),
      north =
        Math.cos(lat) * Math.sin(dec) -
        Math.sin(lat) * Math.cos(dec) * Math.cos(h);
    const incidence =
      east * Math.sin(beta) * Math.sin(az) +
      north * Math.sin(beta) * Math.cos(az) +
      z * Math.cos(beta);
    return { z: Math.max(0, z), incidence: z > 0 ? Math.max(0, incidence) : 0 };
  });
  const norm = samples.reduce((s, v) => s + v.z * 0.25, 0);
  const diffuse = Math.min(r.ghi, Math.max(0, r.dhi));
  const beam = Math.max(0, r.ghi - diffuse);
  const hourly = Array(24).fill(0) as number[];
  samples.forEach((v, i) => {
    if (v.z <= 0 || !norm) return;
    const poa =
      (beam * v.incidence) / norm +
      (((diffuse * v.z) / norm) * (1 + Math.cos(beta))) / 2 +
      (((r.ghi * v.z) / norm) * 0.2 * (1 - Math.cos(beta))) / 2;
    hourly[Math.floor(i / 4)] += poa * 0.25;
  });
  return { daily: hourly.reduce((a, b) => a + b, 0), hourly };
}
