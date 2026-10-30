# Python checks and MCP tools

## Automatic Python proofreading

For this small guide, use **Ruff** as the default Python tool. It combines lint checks and a formatter designed to be close to Black’s style. [Ruff’s formatter](https://docs.astral.sh/ruff/formatter/) and [installation guide](https://docs.astral.sh/ruff/installation/) explain the commands and editor support.

On a Mac with `uv`, install Ruff once for your user:

```sh
uv tool install ruff
ruff check scripts/install-services.py
ruff format --check scripts/install-services.py
```

To apply safe lint fixes and formatting deliberately:

```sh
ruff check --fix scripts/install-services.py
ruff format scripts/install-services.py
```

For live editor diagnostics and formatting on save, install the Ruff extension for Visual Studio Code (or configure Ruff’s language server in your editor). A local hook can run before each commit after installing `pre-commit`. A GitHub Actions check can run the same rules on every pull request. These checks catch style issues and selected classes of bugs; they do not certify security.

**Black** is useful when a project wants a formatter only. Install it with `uv tool install black` and run `black --check .` or `black .`. Black formats code; it does not lint, type-check, or detect SQL injection. Do not run Black and Ruff’s formatter back and forth on the same project—choose one formatter and keep it consistent.

If you want stronger checks, add a type checker such as Pyright and run tests that cover the changed behavior. For SQL injection, use parameterized queries by design and add a security scanner such as GitHub CodeQL or Semgrep to code review. A clean style check is not a security test.

## MCP recommendations for Codex and Claude Code

MCP is a shared protocol; a compatible MCP host can connect to a server regardless of whether the chosen model is OpenAI or Anthropic’s Opus. Check whether the client is Claude Code, Codex, or ChatGPT before following setup steps—the client configuration differs. Anthropic documents MCP support across Claude products, and OpenAI documents MCP servers for Codex and ChatGPT. [Anthropic MCP overview](https://docs.anthropic.com/en/docs/mcp) · [OpenAI MCP overview](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)

| Recommendation | Use it for | Fit |
| --- | --- | --- |
| **OpenAI Developer Docs MCP** | Current OpenAI API, Codex, and ChatGPT documentation | Read-only, official OpenAI docs; supports Codex and Claude Code. [Setup for Codex and Claude Code](https://developers.openai.com/learn/docs-mcp) |
| **GitHub MCP Server** | Reading repositories, issues, and pull requests | Official GitHub server; begin with its read-only endpoint, then grant write access only when a task needs it. [Remote server details](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md) |
| **Microsoft Playwright MCP** | Browser-based UI checks for Open WebUI or a local project | Official browser automation server; useful when a task needs real browser interaction. Use an isolated browser profile and avoid granting access to a logged-in personal profile. [Project and setup](https://github.com/microsoft/playwright-mcp) |
| **Context7 (optional)** | Fetching current third-party library documentation | Works with Codex and Claude Code, but is a third-party hosted service. Keep queries free of secrets. [Client setup](https://context7.com/docs/resources/all-clients) |

The GitHub connection is already available in this environment, so installing a second GitHub server is optional. For Claude Code, Anthropic’s `/mcp` command shows which servers are connected. In Codex, `codex mcp list` shows its configured MCP servers.

Use one server at a time when learning. Prefer read-only tools until a workflow requires a write. MCP servers can access the accounts and files granted by the client; review each server’s maintainer, permissions, and data policy before connecting it.
