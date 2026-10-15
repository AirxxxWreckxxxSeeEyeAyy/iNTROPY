# SHIFT / iNTROPY visual and coding style

## Visual language
- Use navy navigation, blue selected controls, white panels, and cool gray workspace surfaces.
- Keep the interface suited to commercial sales presentations: compact labels, clear inputs, readable figures, and consistent borders.
- Preserve amber solar, blue storage, and green savings indicators.
- Avoid decorative gradients, grain, theme experiments, and visible beta-testing controls.
- Preserve responsive layouts, accessible contrast, and visible keyboard focus.

## Implementation
- Use TypeScript and existing React components; keep simulation logic in app/model.ts separate from presentation.
- Prefer shared CSS variables and readable multiline CSS for new rules.
- Keep estimate assumptions and equipment limitations accessible.
- Run TypeScript and the existing build before release. Check controls, dialogs, navigation, and narrow layouts when browser QA is available.
- Document verification limits; describe a release as live only after confirmed deployment.
