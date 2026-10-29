# SHIFT R data preparation

The deployed Cloudflare Worker hosts the NASA, NOAA UV and GOES JSON routes.
It cannot execute a native R process. County statistics are computed in R before
publication and served as versioned JSON/CSV. This is batch analytics, not a live R server.

To reproduce: `npm install --prefix analysis webr@0.6.0` (or the version in package.json),
then from the Site root `node analysis/run.mjs`.
Native R also supports `Rscript analysis/county_statistics.R` to reproduce the CSV.
The Node wrapper converts R output to JSON without recomputing statistics.

Source: NREL City and County Energy Profiles, DOI 10.25984/1788084, 2016 model
vintage published in 2019 (not 2019 consumption). The original XLSB download was
unavailable during implementation. `data/florida-source.csv` preserves the 67
Florida rows of Michael Minn's documented CSV redistribution:
https://michaelminn.net/tutorials/data/2019-county-energy-profiles.csv
Metadata: https://michaelminn.net/tutorials/data/2019-county-energy-profiles.html
Primary methodology: https://docs.nlr.gov/docs/fy19osti/72748.pdf
Primary dataset/license: https://data.openei.org/submissions/149 (CC BY 4.0).
Redistribution and transformation are explicitly attributed in the site.

Residential electricity per household uses occupied housing units, not utility
accounts. Costs are expenditure/consumption ratios, not tariff quotes. 2016 has
8,784 hours; mean county demand is not a measured peak. No estimates here are
applied automatically to customer bills or the household load model.

NASA POWER: monthly GHI/DHI climatology 2001–2020; no API key required. NOAA:
nearest bulletin city (distance displayed); stale forecasts are labeled. GOES:
timestamped image selected from NOAA's published Southeast sector image list.
Unavailable providers return explicit error states. No fake or silent fallback data.
