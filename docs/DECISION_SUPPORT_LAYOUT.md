# Decision-support layout

This revision implements the decision-support-first concept from SHIFT's October 14–15 design comparison. It is a design hypothesis; the figures did not constitute a randomized A/B experiment and no winner is claimed.

## User journey

1. Choose solar alone or solar with storage; changing this choice preserves the home, sunlight and rate inputs.
2. Compare modeled daily energy costs and coverage. The utility-only, solar-only and current-storage figures use the same household demand and rates.
3. Inspect the array, roof, sunlight source, import/export rates and storage assumptions next to the results. Link directly to rates or sunlight for editing.
4. Explore the retained energy-flow model, time controls and hourly profile below the summary.
5. Prepare questions about equipment compatibility, installed cost, permits and actual usage for an installer. This revision does not claim an integrated supplier checkout or expert-contact service.

Comparisons cover modeled daily energy charges. They exclude equipment, installation, financing, fixed fees and taxes. A cost reduction is not profit, payback or a guaranteed bill saving. Reference equipment is not a validated compatible product package.

## Research provenance

The prior review included Palm & Eriksson (2018), [solar-consumer information study](https://doi.org/10.1186/s13705-018-0156-1), together with trade-show and retail literature and organizer reports. Its recorded conclusion emphasized clear information, comparison, explicit assumptions and access to knowledgeable help. The translation into this interface is a design inference. This revision does not make new effectiveness claims or assert consensus for a particular layout.

## Verification

`pnpm run check` runs TypeScript, ESLint with zero warnings allowed, scenario-arithmetic checks, and the production build. The build audits client chunk modules and fails if the solar model, panel-plane calculations, engine adapter or request parser enter the client bundle. GitHub Actions also starts a local preview and runs `node scripts/check-api.mjs` against it. Review responsive desktop/mobile layout, scenario selection, sliders, comparison arithmetic, rate editing, keyboard focus, dialogs, reset and navigation in browser QA. Record actual outcomes in the pull request; do not label unrun checks as passed.

## Server calculation boundary

The page renders its initial scenario on the server. Later changes are debounced and sent to `POST /api/scenario`; monthly panel-plane comparisons use `POST /api/solar-preview`. Browser code receives inputs, results and chart samples. The calculation modules use `server-only` guards, and production source maps are disabled. Changing inputs hides stale result figures until a matching response arrives; failed requests show an error. Recalculation requires access to the application server.

The APIs accept bounded JSON bodies (8 KiB), enforce strict schemas and finite numeric ranges, reject unknown fields and foreign browser origins, and return errors without stack traces. Input data is not executed as code. No application-level rate limiter or authentication requirement is added for these public demo endpoints; origin checks do not stop direct HTTP clients.

Public source remains readable on GitHub. Server execution and compilation keep the implementation out of the browser download; they do not make public source secret or guarantee resistance to inference from outputs.
