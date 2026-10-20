# Eric's Stacks portfolio

**Systems administration · Security labs · Embedded devices · Local AI · Agent evaluation**

I am building a portfolio of reproducible technical work: systems that can be deployed, tested, diagnosed, and recovered. This collection contains work in progress and a practical curriculum. Each project separates recorded history from new evidence and future goals.

## Project collection

| Project | Intended outcome | Current evidence | Next demonstration |
| --- | --- | --- | --- |
| [P01 — Remote host administration](CASE_STUDIES.md#p01--remote-host-administration) | Reliable Air-to-Pro administration | SSH key login and screen reattachment reported in saved setup records; guide uploaded | Repeat access, disconnect/reconnect, and recovery with timestamped evidence |
| [P02 — Defense and recovery](CASE_STUDIES.md#p02--defense-and-recovery) | Detect a lab event and restore service/data | Curriculum prepared; no completed case study | Restore a synthetic dataset and investigate a known lab event |
| [P03 — Offensive assessment](CASE_STUDIES.md#p03--offensive-assessment) | A scoped lab assessment with actionable findings | Existing wireless lab repository identified; results not audited here | Reproduce two lab findings, document impact, and retest a mitigation |
| [P04 — ESP32 and IDE workflow](CASE_STUDIES.md#p04--esp32-and-ide-workflow) | Build, deploy, diagnose, and recover firmware | Manufacturer display image prepared in prior work; flash outcome unverified | Reconfirm board, reproduce a build, and capture functional/recovery results |
| [P05 — Local AI operations](CASE_STUDIES.md#p05--local-ai-operations) | Operate a local model service within measured limits | Guide records interactive model use and a health check; fresh reproduction pending | Test offline inference, restart behavior, and data restoration |
| [P06 — Agent workflow evaluation](CASE_STUDIES.md#p06--agent-workflow-evaluation) | A bounded assistant with measured task accuracy | Evaluation design and fixtures prepared; no scores claimed | Run normal, failure, and permission-boundary cases |

These are learning projects, not claims of completed client engagements or certification. A successful lab test supports the specific configuration and scenario tested.

## Start here

1. Follow [Start here](START_HERE.md) for the order of work and Saturday's Ruff project.
2. Use the [lesson set](lessons/01-ssh.md): 3 foundation lessons plus 4 lessons in each of 6 tracks.
3. Run the [acceptance tests](TEST_PLAN.md) and capture results with the [test report template](templates/TEST_REPORT.md).
4. Update [progress](data/progress.csv) and the relevant [case study](CASE_STUDIES.md) only after inspecting evidence.

| Track | Lessons | Portfolio deliverable |
| --- | --- | --- |
| [SSH and host administration](lessons/01-ssh.md) | S1–S4 | Host diagram, access runbook, recovery record |
| [Defensive security](lessons/02-defense.md) | D1–D4 | Baseline, detection timeline, restore report |
| [Offensive security](lessons/03-offense.md) | O1–O4 | Lab scope, findings report, retest |
| [ESP32 and IDE work](lessons/04-esp32.md) | E1–E4 | Board manifest, source/build record, device demo |
| [Local AI administration](lessons/05-local-ai.md) | L1–L4 | Service runbook, measured evaluation, recovery |
| [Agent instructions and evaluation](lessons/06-agents.md) | A1–A4 | Task specification, bounded tool design, evaluation results |

## How outcomes are demonstrated

Each completed case study needs a baseline, a reproducible procedure, expected versus actual results, a controlled failure/recovery exercise, and an explanation of limits. Keep failed attempts in the record; do not report only the best run.

Evidence status progresses from **planned → practiced with assistance → independently reproduced → reviewed**. Reading a lesson or passing Ruff does not prove operational readiness.

Existing work: [headless Mac guide PR](https://github.com/AirxxxWreckxxxSeeEyeAyy/iNTROPY/pull/3) and [wireless lab repository](https://github.com/AirxxxWreckxxxSeeEyeAyy/wifi-pineapple-captive-portal-lab). Reference documents and standards are listed in [Sources](SOURCES.md).

## Publishing evidence

Use synthetic accounts, files, and prompts. Keep originals private; commit only reviewed, redacted evidence with stable pseudonyms. Record what was redacted. Omit keys, tokens, client information, real credential captures, private chats, and live account databases.

The existing repository license policy applies; this folder does not grant a new project-wide license. Third-party materials retain their own terms.
