# Tampa Bay historical weather

Revision: Color grading and theme revision (2026-10-10).

`build.py` regenerates `public/data/tampa-weather.json` from retained source files.

- Climate: NOAA NCEI Tampa International USW00012842 monthly normals, 1991–2020. Published CSV has Fahrenheit temperature and inches precipitation. Downloaded 2026-10-10:
  https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00012842.csv
- Clouds: Iowa Environmental Mesonet historical routine METAR reports, stations TPA, PIE, ZPH, UTC range 2025-01-01 through 2026-01-01 (exclusive), skyc1–4. Request:
  https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?station=TPA%2CZPH%2CPIE&data=skyc1%2Cskyc2%2Cskyc3%2Cskyc4&sts=2025-01-01T00%3A00%3A00Z&ets=2026-01-01T00%3A00%3A00Z&tz=UTC&format=onlycomma&report_type=3&latlon=no&elev=no&missing=M
- FAA station context: https://www.faa.gov/air_traffic/weather/asos
- Zephyrhills FAA chart supplement identifies AWOS-3PT:
  https://aeronav.faa.gov/afd/22JAN2026/SE_191_22JAN2026.pdf

Use one last routine observation per local clock hour, 08:00–17:59 America/New_York. Exclude missing cloud categories. Obscured skies remain in the valid denominator as a separate class. Never interpret the proportion of broken/overcast reports as a quantitative solar-loss multiplier. Cloud observations are an IEM archive of aviation observations, not a direct FAA historical API. Station history, sensor limits and differences from a roof remain important limitations.
