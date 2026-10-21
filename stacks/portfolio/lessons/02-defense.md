# Defensive security and recovery

Project: P02. Prerequisites: F1–F3 and S1–S3. Use synthetic data and an isolated lab service.

## D1 — Establish a defensible baseline

**Learn:** least privilege, service exposure, patch inventory, secrets handling, and default-deny versus explicit exceptions.

**Practice:** list intended listeners, service owners, data directories, versions, and expected access paths. Compare intended exposure with actual listeners and one check from the authorized client. Explain launchd on macOS versus systemd on Linux.

**Pass:** D-01 accounts for every listener in the lab's scope. Linux administration claims require repeating the exercise in a Linux lab; a macOS result does not establish Linux proficiency.

**Save:** baseline table, actual-versus-intended comparison, and one reviewed hardening change with rollback.

## D2 — Restore what you back up

**Learn:** recovery point objective (acceptable data loss), recovery time objective (acceptable downtime), consistent application backups, checksums, and restore isolation.

**Practice:** create a small synthetic dataset and hash manifest. Back it up using the intended method. Delete only a disposable working copy, then restore into a new location. For a database, use its supported backup method or stop writes before copying.

**Pass:** D-02 verifies all expected files/records and a useful application read, with measured recovery time. A checksum alone does not prove database usability.

**Save:** restoration procedure, hash comparison, application check, and achieved recovery measurements.

## D3 — Turn logs into a detection

**Learn:** event generation versus collection versus alerting, timestamps, false positives, and basic investigation.

**Practice:** define a benign test marker and a lab event worth detecting. Generate one known event, inspect collected records, create a simple alert/query, then run it again alongside normal activity.

**Pass:** D-03 finds the seeded event and explains any alerts on the normal control activity. Report the observed sample, not a general detection percentage.

**Save:** event/query, timestamped timeline, alert evidence, and investigation notes.

## D4 — Conduct a paired defense exercise

**Learn:** a security finding becomes useful when a control change and retest demonstrate improvement.

**Practice:** pair with O4 using the same isolated target. Identify the harmless simulation in logs, apply a focused defense, replay the same scenario, and check a legitimate user action.

**Pass:** explain whether the change prevents, detects, or merely records the behavior. Restore normal service and complete D-01 through D-03.

**Save:** one-page incident summary, before/after evidence, and limitations.

Reference: [MITRE ATT&CK](https://attack.mitre.org/) provides a vocabulary for adversary behavior. Map only behaviors actually demonstrated; a technique label is not proof of coverage.
