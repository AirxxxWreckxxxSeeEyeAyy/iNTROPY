# 1. Prepare the MacBook Pro

**Run the commands on the Pro in this chapter.** Use its own keyboard initially. Later you can run them from an SSH connection to the Pro.

## Before you begin

- Use a Mac supported by the current Ollama release. The documented minimum is macOS Sonoma 14; Apple silicon supports GPU acceleration. Intel Macs follow a different performance path and are not validated by this beta. [Ollama macOS requirements](https://docs.ollama.com/macos)
- This guide’s reference Pro has an M1 chip and 8 GB RAM. Allow roughly 20–30 GB of free storage for a small initial collection, packages, and caches; that is a planning allowance, not a fixed requirement.
- Plug in the Pro, leave the lid open, and connect both Macs to the same trusted Wi-Fi or Ethernet network.
- Internet access is needed for installation and initial model downloads.
- Download this repository using GitHub’s **Code → Download ZIP**, unzip it, and put the folder somewhere you can find again. Inside the ZIP, open `stacks/headless-macbook-pro-ai-guide`; this is the guide folder used below.

Open **Terminal** from Applications → Utilities. A command is text you paste at the shell prompt, then press Return. Do not paste the prompt characters (`%`, `$`, or `>>>`). Password entry may show no characters; that is normal.

## A. Install Ollama

Download the macOS app from [Ollama’s official download page](https://ollama.com/download/mac), open the disk image, and move the app to Applications. Open Ollama and follow its prompt to make the command available. The official macOS installation also supports a per-user Applications folder. [Installation details](https://docs.ollama.com/macos)

In **Pro Terminal**:

```sh
ollama --version
```

If the command is missing but the app is in Applications, try its full path:

```sh
/Applications/Ollama.app/Contents/Resources/ollama --version
```

Keep the app running for the model-download step.

## B. Download and try a model

In **Pro Terminal**, download the two main models, one at a time:

```sh
ollama pull gemma3:4b
ollama pull llama3.2:3b
ollama list
```

Optional, after the first two work:

```sh
ollama pull qwen3:4b
```

These are local model tags, not cloud-model selections. Check the [upstream model pages and terms](models-and-licenses.md) before downloading. A smaller `gemma3:1b` or `llama3.2:1b` can be a useful fallback on a memory-constrained machine; these variants are not part of our tested baseline.

Try a short conversation:

```sh
ollama run gemma3:4b
```

At `>>>`, type a question. Type `/bye` to return to the shell. To try Llama instead:

```sh
ollama run llama3.2:3b
```

Expect a delay when a model first loads. If the Mac struggles, close other large apps and try a smaller model. Do not assume a downloaded model remains permanently loaded in memory.

## C. Install Open WebUI

Open WebUI is the browser interface; Ollama is the program doing model inference. Use native Ollama on the Pro for this guide. The browser interface can be installed as a Python application, without adding Docker to this small Mac.

Install the `uv` Python tool manager from its official source. In **Pro Terminal**:

```sh
curl -LsSf https://astral.sh/uv/install.sh -o /tmp/headless-ai-uv-install.sh
sh /tmp/headless-ai-uv-install.sh
```

Open a new Terminal window, then install a persistent Open WebUI tool environment:

```sh
~/.local/bin/uv tool install --python 3.11 'open-webui==0.12.3'
~/.local/bin/open-webui --help
```

Version `0.12.3` matches the inspected beta installation. This is a reproducibility pin, not a recommendation to ignore later security updates. Review upstream releases before upgrades. `uv tool install` keeps the application available locally; it does not require downloading an ephemeral tool at every login. [uv tool guide](https://docs.astral.sh/uv/guides/tools/)

Python 3.11 is used here to match the reference setup. The official guide explains supported Python versions and why a persistent `DATA_DIR` matters for keeping chats. [Open WebUI Python installation](https://docs.openwebui.com/getting-started/quick-start/)

## D. Start the background services

In **Pro Terminal**, move into the `stacks/headless-macbook-pro-ai-guide` folder inside your unzipped repository. Type `cd ` with a trailing space, drag that folder from Finder into Terminal, then press Return.

Preview the files the helper will create:

```sh
~/.local/bin/uv run --python 3.11 scripts/install-services.py server
```

Before starting the new services, **quit the Ollama menu-bar app** and disable that app’s own login launch. If you manually started another Open WebUI or Ollama process, stop it first. Two servers cannot use the same port. The helper refuses to take over ports owned by another installation.

Save and start this guide’s services:

```sh
~/.local/bin/uv run --python 3.11 scripts/install-services.py server --apply --load
```

The helper creates per-user LaunchAgents for Ollama and Open WebUI. They listen only on the Pro’s `127.0.0.1` address. It stores Open WebUI data in `~/.local/share/headless-ai/open-webui`, and keeps its generated signing secret in a private file. It limits Ollama to one loaded model and one parallel request, with a 2,048-token default context. Ollama cloud features are disabled. Those memory and cloud settings come from [Ollama’s configuration reference](https://docs.ollama.com/faq).

On AC power, a `caffeinate -s` wrapper keeps the server awake while allowing display sleep. These are **login services**: after a reboot, log in to the Pro once. Do not disable FileVault or enable automatic login as a shortcut around this requirement.

Check both services:

```sh
curl --fail http://127.0.0.1:11434/api/tags
curl --fail http://127.0.0.1:8080/health
```

The first returns model information. The second should return a healthy status such as `{"status":true}`. The first Open WebUI start can take time while preparing its database and caches.

Then open **http://127.0.0.1:8080** in a browser on the Pro. Continue with the [Air connection guide](02-connect-from-air.md).

## Existing-installation note

If you already have working launch services, use them and adapt the guide instead of installing a second copy. This helper uses a **new data directory**; it does not migrate an existing Open WebUI chat database. Export your chats and back up the original data before a migration. No model weights or chat data are deleted by the installer.

To change files previously generated by this helper, preview the new options first, then use `--apply --replace --load`. Differing files receive timestamped backups. `--load` restarts this guide’s services, so finish active chats first.
