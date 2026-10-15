# iNTROPY

Compare power load-shifting strategies and choose solar and battery equipment that fits your household demand, budget, and backup requirements.

[Open Energy Studio](https://shift-energy-studio.szk94zzjr7.chatgpt.site/)

## Overview

iNTROPY models how energy moves between rooftop solar, battery storage, household loads, and the grid. Adjust equipment and operating assumptions to compare energy use and estimated daily costs.

The current application is a scenario-planning tool. It does not automatically select an optimal system or replace site-specific engineering.

## Features

- Hourly solar generation, battery charging and discharging, household demand, and grid imports.
- Adjustable panel count, battery capacity, reserve, shading, roof orientation, and evening AC demand.
- Panel-technology and battery-chemistry comparisons.
- Editable electricity rates, export credits, and a basic generator fuel-cost benchmark.
- NASA POWER seasonal sunlight, NOAA UV forecasts, and GOES imagery.
- Tampa Bay county energy comparisons, climate normals, and historical airport cloud observations.
- Interactive home view, energy layers, charts, and day playback.
- Local usability-session recording and JSON export.

## Development priorities

**Color grading:** refine contrast, visual hierarchy, and consistent colors for generation, storage, demand, and grid supply. Keep charts readable without relying on color alone.

**User attention and comprehension:** review control visibility, navigation, task completion, and interpretation of results. Measure whether users understand kW versus kWh, battery reserve, energy flows, and cost assumptions. Click and hover metrics support usability review; they do not measure comprehension.

**Setup logic:** define Boolean eligibility and compatibility rules with documented inputs, decision tables, and boundary tests.

**Engineering review:** strengthen source attribution, calculation validation, equipment assumptions, and reviewer documentation. Record relevant qualifications, review scope, dates, and findings before making professional-review claims.

## Roadmap

| Version | Scope | Status |
| --- | --- | --- |
| Current | Solar and battery scenarios, energy-cost comparisons, environmental context | Available in the hosted application |
| 2 | Generator equipment comparison, fuel use, operating limits, and backup/load-shifting scenarios | Planned |
| 3 | Flywheel storage in vacuum enclosures and hydrogen fuel-cell comparisons | Research and feasibility |

The existing generator calculation is a fuel-cost benchmark, not a full generator module. Flywheels store supplied energy; fuel cells convert fuel into electricity. Future comparisons will account for losses, operating limits, supply requirements, cost, and lifecycle impacts.

These are product-roadmap stages, separate from hosting revision numbers.

## Research and validation

Environmental inputs use NASA and NOAA sources. Engineering and customer-comprehension research will be reviewed at the original publication level, using Google Scholar for discovery.

The research plan includes peer-reviewed work from public engineering universities, including institutions verified in a specified U.S. News & World Report top-10 public-engineering ranking. Ranking edition, category, and paper affiliation must be documented before making that claim. No top-10 roster or institutional validation is claimed.

Evidence is assessed by relevance, methods, and reproducibility. Agency data and university publications do not imply endorsement or certification.

See [Research standards and references](docs/RESEARCH.md).

## Technology

| Layer | Stack |
| --- | --- |
| Application | TypeScript/TSX, JavaScript, React 19, Vinext |
| UI | Tailwind CSS 4, custom CSS, shadcn/ui, Radix UI, Lucide, SVG |
| Build | Vite, Node.js, pnpm, TypeScript, ESLint |
| Hosting | ChatGPT Sites, Cloudflare Workers |
| Local Worker development | Wrangler, Miniflare |
| Data preparation | R/webR, Python, Node.js |
| Data formats | JSON, CSV |

Vinext uses Next.js-compatible application conventions. The application source also contains optional Drizzle, D1, and R2 scaffolding; database and object-storage bindings are not configured.

This repository currently contains project documentation. Application source is maintained separately.

## Use cases

- Compare equipment configurations against household loads and backup priorities.
- Explore shifting evening demand to stored solar energy.
- Prepare for installer discussions with explicit scenario assumptions.
- Explain renewable integration, grid imports, reserves, and rate tradeoffs.
- Support homeowner education and energy demonstrations.

## Limitations

Outputs are modeled estimates, not live meter readings, installation drawings, or guaranteed savings. The cost worksheet does not represent a complete investment analysis.

Historical data, climate averages, forecasts, and user-entered assumptions are distinct inputs. UV and satellite image brightness are not converted to solar output; airport cloud frequencies do not automatically reduce generation.

## Design backlog

## License

No project-wide license has been selected. Public access does not grant a general open-source license.

Third-party software retains its own terms. The application source includes MIT notices for the Sites Vite plugin and vendored shadcn stylesheet; these do not license the complete application.

The county-data documentation identifies the underlying NREL/DOE dataset as CC BY 4.0. Preserve dataset attribution, redistribution credits, transformation notes, and applicable asset and dependency notices.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for issue reporting, pull requests, verification, and community expectations.
