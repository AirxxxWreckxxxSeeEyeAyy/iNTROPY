# SSH and host administration

Project: P01. Prerequisites: F1 and a local recovery path to the Pro. Resume the saved Air-to-Pro setup; do not replace it with an Air server.

## S1 — Know which machine and identity you are using

**Learn:** client versus server, name resolution, account identity, host keys, public-key authentication, and the distinction between an interactive shell and an automation session.

**Practice:** draw Air → SSH → Pro. Record versions and confirm the `pro` alias. Compare the server host-key fingerprint through a trusted local view. Trace a failed connection through resolution, TCP reachability, host verification, and authentication.

**Pass:** explain why a password login in one Terminal does not authenticate another tool session. Complete S-01 from the [test plan](../TEST_PLAN.md).

**Save:** redacted host diagram, configuration excerpt, and successful identity check.

## S2 — Keep work alive across a disconnect

**Learn:** screen sessions, detach/reattach, keepalives, and client reconnect helpers.

**Practice:** create a dedicated screen session with a synthetic marker. Detach, reconnect, then deliberately close only the test SSH connection and reconnect again. Record session identity and the marker.

**Pass:** S-02 preserves the existing session through a transport disconnect. Explain why a Pro reboot destroys that in-memory session.

**Save:** timestamps, session identifiers with consistent pseudonyms, and recovery duration.

## S3 — Manage a service lifecycle

**Learn:** per-user launchd jobs, foreground commands, environment variables, logs, exit status, and the difference between login startup and unattended boot.

**Practice:** inventory the actual service labels before operating on them. Use a disposable service fixture to exercise start, status, failure, stop, and restart. Diagnose one intentional configuration error and restore the previous version.

**Pass:** identify the failed job from logs, restore it, and show that unrelated services continue. Complete the service portion of S-03.

**Save:** lifecycle runbook, error evidence, corrective diff, and result.

## S4 — Prove recovery and hand over the host

**Learn:** AC idle sleep, display off, lid close, logout, reboot, and disk-unlock/login dependencies are different states.

**Practice:** test one state at a time. Begin with display off on AC and lid open. Record SSH observations over a defined interval. Plan a reboot only with local recovery access and active work accounted for; document any human unlock/login step.

**Pass:** complete S-03, then explain the tested operating envelope and demonstrate recovery from the service failure. A login-dependent service must be described as such.

**Save:** measured timeline and a handoff that another operator can follow.

Reference: [OpenSSH manuals](https://www.openssh.org/manual.html). Those web manuals track development releases; confirm installed options with local `man ssh` and `man ssh_config`.
