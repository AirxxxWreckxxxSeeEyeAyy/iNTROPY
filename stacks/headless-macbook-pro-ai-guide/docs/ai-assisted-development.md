# AI-assisted coding: a research-informed workflow

This section is written for people using Codex, Claude Code, or a local model to help change a project. “Prompting” means describing the task and constraints in ordinary language. It does not replace review, tests, or security analysis.

## A practical workflow

1. **Describe the task clearly.** Name the file or component, the intended outcome, important constraints, and what should remain stable. Include a small input/output example or acceptance criteria when you have one.
2. **Ask for a review before a broad rewrite.** Have the coding assistant summarize its understanding, uncertainties, affected files, and likely risks. Narrow the request if the summary is wrong.
3. **Keep changes small and inspectable.** Request a focused patch, read the diff, and check that unrelated code and configuration did not change. Berkeley researchers observed that users may lose track of AI changes and decisions as code-generation interactions move quickly. [Zamfirescu-Pereira et al., CHI 2025](https://doi.org/10.1145/3706598.3714154)
4. **Verify claims with tools.** Run syntax checks, lint/format checks, tests that cover the changed behavior, and security analysis appropriate to the code. Review the results yourself before merging.
5. **Keep sensitive material private.** Do not include SSH private keys, access tokens, personal chat exports, or private hostnames in public prompts, source files, issues, or pull requests.

Berkeley’s study of non-AI experts found that people often explored prompt designs opportunistically and held mistaken expectations about how language models behave. The authors recommend designing for human expectations and evaluating prompt behavior systematically. This supports using specific acceptance criteria and checking outputs rather than relying on “magic words.” [Zamfirescu-Pereira et al., CHI 2023](https://doi.org/10.1145/3544548.3581388)

A useful plain-language request is to explain the goal, point to the relevant file, list constraints, and ask for a small proposed change with the exact checks needed to verify it. Keep that request as ordinary prose; there is no required special syntax.

## What the prompt research can and cannot tell us

The sources below are research references, not guaranteed recipes. Citation counts change over time and vary between Google Scholar, Scopus, and other indexes. Each Google Scholar link opens a title search so its live “Cited by” figure can be checked directly. Google Scholar pages were not accessible to the research browser during this review, so this guide does not claim exact Scholar counts or present a numeric ranking.

### Highly cited foundations relevant to coding prompts

These widely cited foundations are useful context, with limits: the first is an evaluation of a code model, the second studies general reasoning, and the third generates code as an external calculator for numerical reasoning. None proves a prompt will make arbitrary production code correct or secure.

- [Evaluating Large Language Models Trained on Code — Chen et al. (2021)](https://arxiv.org/abs/2107.03374) · [Google Scholar search](https://scholar.google.com/scholar?q=Evaluating+Large+Language+Models+Trained+on+Code+Chen+2021). Introduces HumanEval, which checks functional correctness for programs written from docstrings. The paper itself reports that its best Codex model solved 28.8% of HumanEval problems on the first attempt.
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models — Wei et al. (2022)](https://arxiv.org/abs/2201.11903) · [Google Scholar search](https://scholar.google.com/scholar?q=Chain-of-Thought+Prompting+Elicits+Reasoning+in+Large+Language+Models+Wei+2022). Foundational prompting research for reasoning tasks; it does not establish that asking a coding model to reveal a long chain of thought improves software security.
- [Program of Thoughts Prompting — Chen et al. (2022)](https://arxiv.org/abs/2211.12588) · [Google Scholar search](https://scholar.google.com/scholar?q=Program+of+Thoughts+Prompting+Disentangling+Computation+from+Reasoning+2022). Explores having a model express computation as a program and execute it externally for numerical and financial reasoning. The transferable lesson is to use deterministic tools for computation and verification.

### More focused, newer studies

These works focus more narrowly on code prompts or security and have had less time to accumulate citations than the foundations above. Their Google Scholar links let readers check current counts; they are included for topical fit, not because a low citation count proves quality.

- [Improving ChatGPT Prompt for Code Generation — Liu et al. (2023)](https://arxiv.org/abs/2305.08360) · [Google Scholar search](https://scholar.google.com/scholar?q=Improving+ChatGPT+Prompt+for+Code+Generation+Liu+2023). Tests prompt design on text-to-code and code-to-code tasks; results are benchmark- and model-specific.
- [A Pilot Study on Secure Code Generation with ChatGPT for Web Applications — Jamdade and Liu (2024)](https://doi.org/10.1145/3603287.3651194) · [Google Scholar search](https://scholar.google.com/scholar?q=A+Pilot+Study+on+Secure+Code+Generation+with+ChatGPT+for+Web+Applications). A small pilot focused on SQL injection, XSS, and related web risks. Its own discussion notes limits in the scope and completeness of generated mitigations.
- [Prompting Techniques for Secure Code Generation: A Systematic Investigation — Tony et al. (2025)](https://doi.org/10.1145/3722108) · [Google Scholar search](https://scholar.google.com/scholar?q=Prompting+Techniques+for+Secure+Code+Generation+A+Systematic+Investigation). Reviews prompting techniques and evaluates a subset using 150 security-relevant code prompts. Results vary with the prompt and model; a simple “secure” cue alone did not give a reliable, statistically significant improvement across settings.

### Government cybersecurity reviews

Government reports are valuable primary evidence about the agencies and incidents they examine. They are not peer-reviewed academic articles, and a report’s existence does not make its recommendations a code-generation benchmark.

- **Department of Justice:** [Comprehensive Cyber Review (2022)](https://www.justice.gov/d9/pages/attachments/2022/07/19/ccr_0.pdf). DOJ’s internal review covers its cyber enforcement work as well as its own network defense and workforce. It is an executive-branch agency review.
- **Department of State:** [GAO Cyber Diplomacy review (2025)](https://www.gao.gov/products/gao-25-108445). GAO examined State’s cybersecurity and digital-policy bureau, analyzed agency records, and interviewed officials. GAO is an independent congressional watchdog; the agency studied is State.
- **Cybersecurity and Infrastructure Security Agency:** [Cyber Safety Review Board report on the 2023 Microsoft Exchange Online intrusion](https://www.cisa.gov/resources-tools/resources/cyber-safety-review-board-releases-report-microsoft-online-exchange-incident-summer-2023). DHS released the board’s incident review and recommendations. CISA is part of the executive branch and focuses on cybersecurity; this report provides incident-based government evidence.

The federal reports above are deliberately limited to DOJ, State, and executive-branch cyber work. They provide operational context, not endorsement of this guide or proof that local code assistants are secure.

## SQL injection: prompt it, then verify it

A prompt can remind a coding assistant to address SQL injection, but the protection comes from the implementation. Use parameterized queries or a well-used ORM that parameterizes values. Never assemble SQL by concatenating untrusted input. Security scanners can identify risky data flows, but scan results require review and tests.

For this repository specifically, `install-services.py` does not access a database or issue SQL. Its subprocess calls pass argument arrays instead of constructing shell command strings. This is a check of this small script, not a claim that a formatter or prompt can prevent injection in future code.
