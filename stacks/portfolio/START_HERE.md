# Start here

## The outcome-testing method

For each project, write one claim before touching the system: “A fresh Air Terminal session can reach the Pro without an account-password prompt,” for example.

1. **Define the pass condition.** Include the target, expected output, acceptable duration, and what would count as failure.
2. **Capture the baseline.** Record UTC date/time, machine role, hardware, OS/tool versions, code commit, configuration, and initial state.
3. **Perform the normal operation.** Save commands, outputs, exit codes, and relevant screenshots or logs.
4. **Introduce one controlled failure.** Use a disposable fixture, a lab account, or a planned service interruption. Retain a way to recover access.
5. **Recover and repeat.** Demonstrate the documented repair and a second successful run. Reboot survival is a separate claim from reconnecting to a surviving session.
6. **Explain it yourself.** Describe the mechanism, the evidence, an alternative diagnosis, and the limits. Record any human/AI assistance.
7. **Publish the result.** Fill in the report, link evidence and source commits, and update the case study.

The test targets here are portfolio training targets, not industry certifications or client service-level agreements.

## Three foundation lessons

| ID | Learn | Do | Pass and evidence |
| --- | --- | --- | --- |
| F1 | Shell, files, permissions, process exit codes, and Git branches/diffs | In a scratch directory, create a synthetic text file, inspect its permissions, change it on a branch, review the diff, and restore it | Explain every changed line and recover the original file; save a short transcript and commit references |
| F2 | Python environments, Ruff linting versus formatting, and meaningful tests | Identify Python in each accessible repository; compare existing tooling; preview Ruff changes on a focused branch | `ruff check` and `ruff format --check` pass on the intended files; relevant behavioral tests still pass; no unrelated changes |
| F3 | Reproducible evidence and reporting | Fill in one test report from an actual run, including a controlled failed attempt | Another person can follow the report and identify exactly what passed, failed, or remains untested |

Ruff configuration and fix behavior are documented in the [official tutorial](https://docs.astral.sh/ruff/tutorial/). Review automatic fixes; do not enable unsafe fixes merely to obtain a green check.

## Saturday, October 24, 2026 — first project

Complete F1–F3 through the already planned repository cleanup:

1. Re-inventory repositories and active PR branches. Identify Python files; list repositories without Python as not applicable.
2. Select a compatible Ruff version and configuration per repository. Respect existing language support and exclude vendored/generated files.
3. Run `ruff check` and `ruff format --check` first, save the baseline, then apply formatting and individually reviewed fixes.
4. Run existing relevant tests. If no tests exist, record the gap and add only useful behavior checks for the code being changed.
5. Add GitHub Actions checks and demonstrate both outcomes: a deliberately failing scratch change is caught, and the corrected branch passes.
6. Open one focused cleanup PR per affected repository. Capture before/after results in a case-study appendix.

This is the next planned work session. No calendar reminder or unattended execution has been created.

## Learning order

| Stage | Work | Finish before advancing |
| --- | --- | --- |
| 1 | F1–F3; S1–S4 | Explain access, reproduce SSH, and recover a disposable service |
| 2 | D1–D4 | Establish logs and backups, restore synthetic data, identify a known event |
| 3 | O1–O4 | Use an isolated target and scoped assessment; link offensive activity to defensive evidence |
| 4 | E1–E4 | Confirm the exact board and framework; complete build, device, and recovery evidence |
| 5 | L1–L4 | Reproduce local AI service, offline operation, and recovery |
| 6 | A1–A4 | Bound tool permissions and evaluate normal, adversarial, and failure cases |

Allow roughly 60–90 minutes per practice session; a lesson may take several sessions. Advancement depends on evidence, not a fixed week count. The existing SSH work is a starting point: perform a short diagnostic rather than restarting from zero.

The Pro remains the intended host and the Air the client. Reconfirm the execution machine at every lab. On the recorded 8 GB Pro, run one demanding lab workload at a time and record memory pressure. Local models and a security VM need not run together.

## First practical session after the Ruff cleanup

On the **Air**, privately record `date -u` and `hostname`, then:

```sh
ssh -o BatchMode=yes -o ConnectTimeout=8 pro 'hostname; id -un'
```

The alias `pro` must already identify the intended Pro. Pass when it returns the expected server identity and exit status 0 without prompting for an account password. A failure remains a useful diagnostic: distinguish name resolution, reachability, host identity, and authentication.

Next use S-02 in [the test plan](TEST_PLAN.md) to repeat detach/reattach with a dedicated test session. Keep private usernames and host identifiers out of the public evidence.

## When to offer a service

Offer a narrow administration task only after independently reproducing its setup, diagnosis, recovery, and handoff. Describe exactly which platforms and scenarios you tested. Add supervised experience and reviewed reporting before advertising independent red-team engagements.

Ruff and documentation improve maintainability. They do not establish that a server is recoverable, a device is reliable, or a security assessment is complete.
