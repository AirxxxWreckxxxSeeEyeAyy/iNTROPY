# Case studies and evidence inventory

Prepared October 20, 2026. These entries are honest starting drafts. Acceptance tests in this portfolio have not yet been executed. Recorded setup observations are historical and configuration-specific.

## P01 — Remote host administration

**Problem:** operate a MacBook Pro from an Air while keeping terminal work available through client disconnects.

**Recorded work:** dedicated SSH key setup, an Air shortcut, and a named screen session. Saved setup records from October 19 report account-password-free authentication and successful detach/reattach. The later guide records a transport-disconnect test.

**Artifact:** [headless guide at its uploaded commit](https://github.com/AirxxxWreckxxxSeeEyeAyy/iNTROPY/tree/5c8ba62b7a89601e4a5dd7afda9d709302915b99/stacks/headless-macbook-pro-ai-guide). [PR #3](https://github.com/AirxxxWreckxxxSeeEyeAyy/iNTROPY/pull/3) was open when this portfolio was prepared.

**Evidence quality:** summarized setup observations; fresh raw logs for the new acceptance tests are not attached. The guide's test record references a `tests` directory that is absent from the inspected local/uploaded package; verify or correct that gap before claiming a reproducible automated test suite.

**Still needed:** S-01–S-03, raw redacted evidence, service recovery, and reboot/login dependencies. No claim of lid-closed, overnight, or unattended unlock behavior.

**Case-study completion fields:** measured reconnect time: pending; recovery time: pending; code/configuration commit: pending for new run; reviewer: none.

**Potential service after demonstration:** narrowly scoped remote access and host setup for the tested platform.

## P02 — Defense and recovery

**Problem:** a functioning service needs a documented exposure boundary, useful logs, and recoverable data.

**Recorded work:** lesson/test design only. Existing access and service configuration may provide a baseline but do not establish a complete defensive assessment.

**Planned artifact:** service baseline, backup/restore runbook, event-to-alert timeline, and a one-page incident report.

**Still needed:** D-01–D-03; restore 10/10 synthetic files and the structured dataset; demonstrate three known events against three normal controls.

**Case-study completion fields:** restored hashes/records: pending; measured recovery time: pending; detection latency: pending; false-positive observations: pending; reviewer: none.

**Potential service after demonstration:** basic service hardening, backups, and documented recovery within the tested scope.

## P03 — Offensive assessment

**Problem:** an assessment must distinguish reproducible weaknesses from unconfirmed alerts and explain what to fix.

**Existing starting point:** [wireless captive-portal lab repository](https://github.com/AirxxxWreckxxxSeeEyeAyy/wifi-pineapple-captive-portal-lab). Its existence was confirmed; this portfolio does not claim its code, isolation, or results were audited.

**Planned artifact:** isolated web-security lab, exact scope, two reproducible findings, one mitigation/retest, and a paired defensive observation.

**Still needed:** O-01–O-03. Use synthetic accounts and data. Extend to the wireless lab only after identifying its current configuration and boundaries; do not collect real user credentials.

**Case-study completion fields:** target/version: pending; confirmed findings: none recorded here; successful retests: none recorded here; reviewer: none.

**Potential service after demonstration and appropriate experience:** scoped assessment assistance. This draft does not establish readiness to lead independent red-team engagements.

## P04 — ESP32 and IDE workflow

**Problem:** restore a display board and establish a reproducible source-to-device workflow.

**Recorded work:** earlier notes identify a likely LCDWIKI E32R40T-family board and a prepared manufacturer demonstration image. Existing backup was user-confirmed. The saved record does not confirm flashing or successful display behavior.

**Planned artifact:** exact board manifest, supported source example, dependency versions, build logs, input/output demo, and restore procedure.

**Still needed:** E-01–E-03. Reconfirm current hardware and serial connection; demonstrate both a source build and runtime behavior. Manufacturer binary restoration and compiling personal source are separate achievements.

**Case-study completion fields:** current board identity: pending; successful clean build: pending; functional checks: pending; restored firmware verified: pending; reviewer: none.

**Potential service after demonstration:** prototype bring-up and documented firmware workflows for the specific tested board.

## P05 — Local AI operations

**Problem:** operate local inference and a browser UI with predictable access, resource use, and recovery.

**Recorded work:** the [guide test record](https://github.com/AirxxxWreckxxxSeeEyeAyy/iNTROPY/blob/5c8ba62b7a89601e4a5dd7afda9d709302915b99/stacks/headless-macbook-pro-ai-guide/docs/tested-configuration.md) reports an M1 Pro with 8 GB RAM, interactive Gemma use, a UI health endpoint, and Llama loaded on GPU. It explicitly leaves full portable installation, offline browser use, and reboot recovery pending.

**Evidence quality:** historical report, not a new benchmark. GPU loading does not establish answer quality or throughput. The portable installer differs from the original private configuration.

**Still needed:** L-01–L-03; 30 measured workload runs, offline inference, and synthetic-data recovery.

**Case-study completion fields:** current versions/model digest: pending; latency/quality: pending; restored UI data: pending; reviewer: none.

**Potential service after demonstration:** small local AI deployments within a documented model/hardware envelope.

## P06 — Agent workflow evaluation

**Problem:** an administration assistant needs evidence-based output and enforced limits on its tools.

**Recorded work:** curriculum, task design, and 12 evaluation cases prepared. No agent implementation or benchmark result is claimed.

**Planned artifact:** read-only diagnostic assistant, typed output schema, bounded tools, run traces, evaluation report, and a controlled improvement.

**Still needed:** A-01–A-03; implement fixtures/tool enforcement, run all cases three times, and obtain held-out review cases.

**Case-study completion fields:** baseline success rate: not measured; unauthorized actions: not measured; improvement: not measured; reviewer: none.

**Potential service after demonstration:** bounded workflow configuration and evaluation. Model fine-tuning is outside this initial project.

## Final case-study structure

For every completed entry, replace pending fields with evidence-backed values and add:

1. Problem, scope, and constraints.
2. Diagram and implementation choices, including rejected alternatives and tradeoffs when relevant.
3. Source commit, environment, and reproducible steps.
4. Expected versus actual outcomes, including failures.
5. Controlled fault, diagnosis, recovery, and regression check.
6. What was done personally, what assistance was used, and what remains untested.
7. Reviewer/date, objections, and follow-up work.

Use a short demo to explain results, not as a substitute for logs and reproducible steps.
