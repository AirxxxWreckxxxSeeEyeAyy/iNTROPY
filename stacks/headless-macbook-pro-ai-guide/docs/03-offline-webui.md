# 3. Browser chat and offline preparation

## Daily use without an open Terminal

Finish chapters 1 and 2 while online. On the Pro, open `http://127.0.0.1:8080` and create the first Open WebUI account yourself; the first account becomes the administrator. Choose a strong password. On the Air, open **Local AI** on the Desktop or visit `http://127.0.0.1:18080`, then sign in to that same account.

Choose **gemma3:4b** or **llama3.2:3b** in the model selector, create a chat, and send a short message. The model runs on the Pro. If the list is empty, check Admin Settings → Connections and the Ollama address `http://127.0.0.1:11434`. Menu names can change between versions. Keep authentication enabled and close public signups after creating the accounts you need.

Once the login services are running, close the setup Terminal windows. Open the desktop shortcut whenever you want to chat. The Pro must remain awake and logged in, and both Macs must remain on the same local network. This beta provides **Terminal-free everyday use after an initial Terminal-based installation**.

## Download before disconnecting the internet

On the Pro, while online:

1. Finish installing Ollama, Open WebUI, Python, and all dependencies.
2. Download each intended model with `ollama pull`, then generate a reply from each model in the browser.
3. If you need document search, configure and download its embedding model in Open WebUI’s administrator document settings. Upload a harmless sample document and verify retrieval. Embedding/reranking models have separate downloads.
4. If you need speech features, download and test their required models separately. They are optional and outside this beta’s tested scope.
5. Keep the model files, Open WebUI data directory, Python tool environment, and downloaded caches. Do not run cache-cleanup commands before your offline test.

The original installation downloaded an embedding model during first startup. A working text chat alone does not prove that document or speech features are ready offline. See [Open WebUI’s offline preparation instructions](https://docs.openwebui.com/tutorials/maintenance/offline-mode/).

## Enable offline mode

After preparing downloads, on the **Pro**, inside the guide folder:

```sh
~/.local/bin/uv run --offline --python 3.11 scripts/install-services.py server --offline
~/.local/bin/uv run --offline --python 3.11 scripts/install-services.py server --offline --apply --replace --load
```

The first command previews changes; the second restarts this guide’s services. Finish active chats first. This requires the Python runtime already downloaded during setup. If `uv` reports a missing runtime, reconnect and complete that download.

This sets Open WebUI `OFFLINE_MODE=True` and `HF_HUB_OFFLINE=1`. It also retains local Ollama and disables the OpenAI API connection and web search for a fresh installation. Review any existing saved administrator settings and remove external providers, tools, web search, and OAuth dependencies you do not intend to use. **Offline mode is not a firewall:** explicitly configured external services may still attempt network access. [Open WebUI environment reference](https://docs.openwebui.com/reference/env-configuration/)

## Acceptance test: internet off, local network on

Do this when you can briefly interrupt internet access without affecting other people:

- Disable the router’s internet/WAN connection, or use a local network with no internet uplink. Keep the router/local Wi-Fi running so the Air can still reach the Pro. Turning Wi-Fi off on both laptops breaks the SSH connection too.
- Restart the guide’s services using the second command above.
- On the Air, open a new browser tab to `http://127.0.0.1:18080`, sign in, and generate a new reply from each downloaded model.
- Close and reopen the browser; verify the saved conversation remains.
- Test document/speech features separately if you prepared them.
- Record software versions and which checks passed before relying on the setup away from internet access.

**Beta status:** this WAN-disconnected acceptance test has not yet been performed on the reference setup. The guide documents the procedure; it does not claim certification of offline operation.

## Data and backup

The guide’s Open WebUI database and uploads live under `~/.local/share/headless-ai/open-webui` on the Pro; models normally live under `~/.ollama/models`. Keep these out of public Git repositories. Export chats through Open WebUI, and stop the service before copying a live database directory for a filesystem backup. Keep the signing secret private and back it up with application data. Never paste either into a GitHub issue.
