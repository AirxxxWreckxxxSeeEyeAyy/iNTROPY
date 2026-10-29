# SHIFT / iNTROPY visual and coding style

## Visual language
- Use navy navigation, blue selected controls, white panels, and cool gray workspace surfaces.
- Keep the interface suited to commercial sales presentations: compact labels, clear inputs, readable figures, and consistent borders.
- Preserve amber solar, blue storage, and green savings indicators.
- Avoid decorative gradients, grain, theme experiments, and visible beta-testing controls.
- Preserve responsive layouts, accessible contrast, and visible keyboard focus.

## Decision-support hierarchy
- Lead with scenario selection, estimated daily outcomes and editable assumptions.
- Compare utility-only, solar-only and the current storage scenario using the same property and rates.
- Keep the explanatory energy model and detailed controls below the decision summary.
- Use clear labels, visible table headers, keyboard focus and readable narrow-screen layouts.
- Treat the layout as a research-informed hypothesis, not a measured A/B winner.

## Implementation
- Use TypeScript and existing React components; keep `app/model.ts`, `app/solar-math.ts` and `lib/energy-engine.ts` server-only. Client code uses `app/energy-config.ts` for defaults/types and requests results through the calculation APIs.
- Prefer shared CSS variables and readable multiline CSS for new rules.
- Keep estimate assumptions and equipment limitations accessible.
- Run the zero-warning ESLint gate, TypeScript and the production build before release. Check controls, dialogs, navigation, and narrow layouts when browser QA is available.
- Document verification limits; describe a release as live only after confirmed deployment.
