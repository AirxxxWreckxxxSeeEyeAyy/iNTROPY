export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const lat = Number(q.get("lat")),
    lon = Number(q.get("lon"));
  if (
    !q.has("lat") ||
    !q.has("lon") ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < 24 ||
    lat > 32 ||
    lon < -88 ||
    lon > -79
  )
    return Response.json(
      { error: "Enter coordinates within Florida and its immediate region." },
      { status: 400 },
    );
  const u = new URL(
    "https://power.larc.nasa.gov/api/temporal/climatology/point",
  );
  for (const [k, v] of Object.entries({
    parameters: "ALLSKY_SFC_SW_DWN,ALLSKY_SFC_SW_DIFF",
    community: "RE",
    latitude: lat.toFixed(3),
    longitude: lon.toFixed(3),
    format: "JSON",
  }))
    u.searchParams.set(k, v);
  try {
    const res = await fetch(u, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw Error("NASA response " + res.status);
    const d = (await res.json()) as {
      properties?: { parameter?: Record<string, Record<string, number>> };
      header?: { range?: string };
      parameters?: Record<string, { units?: string }>;
    };
    const p = d.properties?.parameter;
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const rows = months.map((month, i) => ({
      month: i,
      ghi: p?.ALLSKY_SFC_SW_DWN?.[month] ?? NaN,
      dhi: p?.ALLSKY_SFC_SW_DIFF?.[month] ?? NaN,
    }));
    if (
      rows.some(
        (v) =>
          !Number.isFinite(v.ghi) ||
          v.ghi < 0 ||
          v.ghi > 12 ||
          !Number.isFinite(v.dhi) ||
          v.dhi < 0,
      )
    )
      throw Error("Invalid solar data");
    return Response.json(
      {
        latitude: lat,
        longitude: lon,
        period: d.header?.range,
        units: d.parameters?.ALLSKY_SFC_SW_DWN?.units,
        source: u.href,
        retrievedAt: new Date().toISOString(),
        rows,
      },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch {
    return Response.json(
      {
        error:
          "NASA sunlight data is temporarily unavailable. Your manual scenario remains available.",
      },
      { status: 502 },
    );
  }
}
