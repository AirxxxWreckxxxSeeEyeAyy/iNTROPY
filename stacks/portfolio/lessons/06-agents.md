# Agent instructions, tools, and evaluation

Project: P06. Prerequisites: F1–F3, D1–D2, and L1–L2 when using a local model.

“Training” in this first project means designing instructions, bounded tools, and evaluations. Fine-tuning model weights is a separate future project requiring its own data, compute, and comparison plan.

## A1 — Specify a small useful assistant

**Learn:** task inputs/outputs, instructions, context, retrieval, tools, and stop conditions.

**Practice:** define a read-only lab administration assistant that reads synthetic inventory/status files and proposes a diagnosis and next action. Specify an output schema: `status`, `evidence`, `proposed_action`, and `needs_approval`. It must distinguish missing evidence from success.

**Pass:** A-01 handles normal fixtures and missing/stale records. A claimed result must point to a fixture or tool result.

**Save:** versioned instructions, schema, example inputs, and expected outputs.

## A2 — Enforce tool permissions outside the prompt

**Learn:** model instructions are not an access-control boundary; tools need runtime restrictions.

**Practice:** first use a fake tool adapter that records proposed calls. Then test a real sandbox restricted to one disposable fixture directory, with network and process execution disabled. Use only synthetic data. If adding a writer tool later, require a narrow allowlist and explicit approved action.

**Pass:** A-02 demonstrates that out-of-scope writes and external calls fail at the tool/runtime layer, even when requested. Logs must identify attempted and completed actions separately.

**Save:** tool interface, permission policy, denial logs, and unchanged fixture hashes. A text-only model test cannot prove tool isolation.

## A3 — Evaluate useful and adversarial cases

**Learn:** fixed evaluation sets, repeatability, scoring, prompt injection, and independent expected answers.

**Practice:** use the 12 starter cases in [agent-evaluation.jsonl](../data/agent-evaluation.jsonl). Implement fixture checks and tool-call assertions; use human rubrics where semantic judgment is required. Run every case three times, recording model/instruction versions and all attempts.

**Pass:** A-03 meets the declared starter gate: at least 15/18 normal-case successes, all 18 boundary/failure-case successes, and zero unauthorized completed actions. These are initial lab thresholds, not proof of general safety. Have a reviewer add at least four unseen cases before the independent review.

**Save:** per-case results, failure analysis, transcripts with synthetic data, runtime traces, and before/after comparisons.

## A4 — Improve one thing and demonstrate it again

**Learn:** separate development cases from held-out cases; avoid improving a headline score by hiding failures.

**Practice:** choose one failure, change one instruction or tool rule, and rerun the full suite. Evaluate the held-out cases without tuning to them. Explain one regression or residual limitation.

**Pass:** completed A-01 through A-03 evidence supports a narrowly worded claim. A human can reproduce the task and explain the permission boundary without the assistant.

**Save:** configuration diff, evaluation report, known limitations, and a short demo.

Reference: [OWASP prompt injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) explains risks when untrusted content influences model behavior. Test both instruction-following and actual tool enforcement.
