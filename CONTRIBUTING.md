# Contributing to iNTROPY

Contributions should improve equipment comparisons, customer comprehension, accessibility, data quality, or the energy model.

The project-wide license remains undecided. Coordinate licensing terms with the maintainer before submitting substantial external code or assets.

## Issues and proposals

Search existing issues and pull requests first. For a bug, include expected and observed behavior, reproduction steps, scenario inputs, browser/device details, and relevant screenshots or errors with sensitive information removed.

For a feature, explain the customer problem and acceptance criteria. Discuss major model changes, new dependencies, and new equipment categories before implementation.

## Pull requests

1. Use a focused branch for one defined change.
2. Follow the surrounding style and reuse existing components.
3. Explain the problem, resulting behavior, assumptions, and tradeoffs; link the issue.
4. Include screenshots for visual changes and reproducible examples for numerical changes.
5. State what was checked and what remains untested.
6. Respond constructively to review; maintainers decide when to merge.

Avoid unrelated formatting, generated dependency folders, build output, credentials, and private customer information.

## Verification

For application changes, run relevant checks and a production build using the application's package scripts. The application source includes build and lint commands but no dedicated automated test command. Do not claim checks passed unless they ran.

Check keyboard access, focus, contrast, mobile layouts, and meanings conveyed without color. Review customer comprehension separately from clicks or hover duration.

For simulation changes, verify units, energy balance, battery bounds, efficiency losses, reserves, and zero-solar/zero-storage cases. Boolean equipment rules need a documented decision table and meaningful boundary tests.

## Research and engineering review

Follow [Research and evidence standards](docs/RESEARCH.md). Cite original papers, methods, data dates, units, assumptions, and limitations. Label preprints, peer-reviewed papers, agency guidance, and manufacturer claims accurately.

Do not invent missing data, claim institutional endorsement, use an unverified university ranking, or call a calculation professionally certified without documented review. Preserve data and license attribution.

For future generators, flywheels, and hydrogen fuel cells, distinguish energy generation, conversion, and storage. Define comparison boundaries before adding performance claims.

## Security, privacy, and conduct

Submit only material you have permission to contribute. Do not include credentials, private customer data, or identifiable usability-session exports.

Use GitHub private vulnerability reporting if enabled; otherwise request a private channel from the maintainer without posting exploit details publicly.

Be respectful and welcoming. Discuss code and ideas rather than attacking people. Explain disagreements with evidence and allow reasonable time for responses.

These guidelines follow [GitHub's contribution-documentation guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).
