# Color grading and theme revision

iNTROPY / Tampa Bay / 2026-10-10

Solar front overlay: amber #E9AD37 with a warm yellow highlight. Low-saturation dark green #354B40 for selected tabs, viewport controls and text; soft green #B5C6AC for secondary surfaces. Matte panels contrast with glossy active controls and model labels. Amber is an intentional solar association, not a claim that a color guarantees conversion.

Reference: Adobe's color-meaning guidance associates orange with energy, yellow with attention, and muted green with nature/calm; it also emphasizes cultural variation and testing:
https://www.adobe.com/creativecloud/design/discover/color-meaning.html

Kelvin/CCT is a white-light specification, not a CSS green setting. Warm-to-neutral whites implement the user's visual direction; screen white point cannot be enforced by a website:
https://www.energy.gov/cmei/femp/purchasing-energy-efficient-light-bulbs

Viewport arrangement uses Blender's central editor/tool-region convention and Windy's layer/time exploration. This is a 2D illustrative home with interactive energy calculations, not an actual Blender renderer or Windy weather model.
https://docs.blender.org/manual/en/latest/editors/index.html
https://www.windy.com/maps

Beta study: explicit opt-in; device-local anonymous summaries; manual export/import for cohort review. No remote collection. One facilitator-started session per tester. Track hover duration on categories/model controls, within-contact touch movement speed, and near-miss candidates (outside by <=28px then corrected within 1800ms). Only tester-confirmed misses count. Threshold = >=65% of touched sessions with confirmed miss, minimum 20 sessions per icon. Review target size/spacing before haptics or optional raised-gradient preview. No automatic redesign and no hardware ghost-touch diagnosis.
https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API

Build and TypeScript checks are the verification gate; browser QA is unavailable in this session.
