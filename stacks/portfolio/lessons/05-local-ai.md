# Local AI administration

Project: P05. Prerequisites: S1–S4 and D2. Use the Pro as host, the Air as client, and synthetic prompts/data.

## L1 — Understand the service boundaries

**Learn:** model runtime, browser UI, SSH tunnel, local versus cloud inference, model storage, and user/session data.

**Practice:** record installed versions and actual service labels. Draw Air browser → SSH tunnel → Pro UI → model runtime. Inspect listeners and the current model inventory. Distinguish the private original deployment from the portable guide's different service names.

**Pass:** L-01 proves which endpoint serves a request and verifies intended network exposure. Do not infer browser usability from a health endpoint alone.

**Save:** service diagram, inventory, listener observations, and browser/API checks.

## L2 — Measure resource use and answer quality

**Learn:** memory pressure, context length, warm/cold model loads, request latency, output quality, and repeatable prompts.

**Practice:** select one installed model and ten fixed synthetic prompts with answer rubrics. Record model identifier/digest, quantization if available, context setting, hardware, elapsed time, and memory observations. Run the set three times with consistent settings.

**Pass:** L-02 includes every attempt, failures, and median/max latency. Set acceptance limits before running; for the starter lab, aim for at least 8/10 rubric passes on each run and no runtime crashes. Report the sample, not a broad intelligence claim.

**Save:** prompt set, per-run results, quality rubric, and resource summary. Keep model comparisons separate if settings differ.

## L3 — Demonstrate offline operation

**Learn:** local inference can still depend on downloads, retrieval models, external tools, or remote authentication.

**Practice:** preload the selected model and needed local assets. In a disposable/test configuration, block internet egress while preserving the local Air-to-Pro path and recovery access. Capture an egress-denial check, then start a new browser conversation.

**Pass:** L-03 generates three new answers with recorded external access blocked. Merely displaying an old conversation does not count.

**Save:** network test evidence, model identity, request timestamps, and limitations such as unavailable external search.

## L4 — Recover the stack and its data

**Learn:** process restart, user login, machine reboot, application-consistent backup, and upgrade rollback.

**Practice:** use a synthetic UI account/conversation in a disposable instance. Stop/start the intended service, then restore its data into an isolated location. Separately record which recovery steps require login or disk unlock.

**Pass:** L-03 restores readable synthetic data and resumes a new inference request. Describe the tested recovery point and time.

**Save:** service/data runbook, backup/restore evidence, and upgrade/recovery checklist.

Reference: [Ollama FAQ](https://docs.ollama.com/faq) documents listener configuration, cloud disabling, context, and loaded-model inspection. Verify actual settings rather than relying on defaults.
