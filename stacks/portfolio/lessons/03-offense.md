# Offensive security and assessment reporting

Project: P03. Prerequisites: F1–F3, D1, and D3. Begin with an owned isolated training target and synthetic accounts. This track teaches assessment foundations before broader red-team work.

## O1 — Scope the exercise and understand the application

**Learn:** authorization, objectives, network boundaries, HTTP requests/responses, sessions, authentication, and authorization.

**Practice:** complete the [scope template](../templates/ENGAGEMENT_SCOPE.md). Choose an intentionally vulnerable local training app such as [OWASP Juice Shop](https://owasp.org/projects/juice-shop). Map the application's expected functions and two test-user roles.

**Pass:** O-01 defines the exact target, permitted activity, stop conditions, recovery, and evidence location. Verify that a target outside the allowlist is excluded.

**Save:** scope, small network diagram, synthetic-account roles, and request inventory.

## O2 — Reproduce and explain two findings

**Learn:** hypothesis, evidence, false positive, impact, and the difference between authentication and authorization.

**Practice:** select two suitable exercises from the training application's documentation. Reproduce them manually using synthetic data. Include a negative control or unaffected request and record the app version.

**Pass:** O-02 reproduces each finding twice after resetting the relevant fixture. Explain the root cause and impact without relying on a scanner label.

**Save:** request/response evidence with sensitive fields removed, reproducible steps, affected component, and proposed correction. Use versioned [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/v42/) references when applicable.

## O3 — Write a client-readable report and retest

**Learn:** scope limitations, risk justification, business impact, actionable remediation, and retest status.

**Practice:** write an executive summary and technical findings. Apply one reversible mitigation to your controlled copy or a separate minimal fixture. Replay the original test and a legitimate-use test.

**Pass:** O-03 records fixed/partially fixed/unresolved accurately. A mitigation that breaks all access does not pass the legitimate-use check.

**Save:** findings report, corrective change, retest evidence, and residual risk.

## O4 — Connect offense with defense

**Learn:** vulnerability assessment seeks weaknesses; an adversary simulation evaluates a defined objective and observable security response.

**Practice:** agree a small lab objective with D4. Use a harmless simulation, such as executing a known marker command through an authorized test account, and correlate the activity with host/application logs. Do not use real stolen credentials or establish hidden persistence.

**Pass:** the report identifies what was observed, what was missed, and what changed after the defensive retest. Completing this lab does not establish independent red-team consulting readiness.

**Save:** scoped simulation plan, timeline, relevant ATT&CK mapping where supported, and paired defense outcome.
