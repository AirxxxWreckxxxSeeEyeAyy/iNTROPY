# Troubleshooting

| Symptom | First check |
| --- | --- |
| `.local` hostname fails | Both Macs must share a local network. Verify the Pro’s current hostname/IP in System Settings; do not reuse an old IP blindly. |
| SSH asks for a password or background tunnel fails | Run `ssh -o BatchMode=yes pro hostname` on the Air. Complete the key/Keychain steps before installing an unattended tunnel. |
| Host-key warning | Verify the Pro’s current fingerprint locally. Do not disable strict host-key checks to hide the warning. |
| Browser says connection refused | Pro: check `curl --fail http://127.0.0.1:8080/health`. Air: check `http://127.0.0.1:18080`. Confirm both users are logged in. |
| Port already in use | Stop the duplicate app/manual tunnel yourself. The installer will not terminate unrelated services. |
| No models in Open WebUI | Pro: run `ollama list`; check the WebUI Ollama connection points to `http://127.0.0.1:11434`. |
| Slow or stalled model | Start one small model at a time, close memory-heavy apps, inspect Activity Monitor, and reduce context. Qwen is optional. |
| Nothing starts after a Pro reboot | Log in locally once; these are user LaunchAgents. A screen session cannot survive reboot. |
| Offline document search fails | Download/test the embedding model while online. Text chat readiness does not establish document-search readiness. |
| New account/chats seem missing | Check which `DATA_DIR` is running. This installer uses a new directory and does not migrate an older installation. |

## Service status and logs

Run on the **Pro**:

```sh
launchctl print gui/$(id -u)/org.headlessmac.ollama
launchctl print gui/$(id -u)/org.headlessmac.webui
tail -n 40 ~/Library/Logs/org.headlessmac.webui.error.log
```

On the **Air**:

```sh
launchctl print gui/$(id -u)/org.headlessmac.webui-tunnel
tail -n 40 ~/Library/Logs/org.headlessmac.webui-tunnel.error.log
```

Inspect locally before sharing: logs and service environments can contain private data. Remove secrets, usernames, addresses, prompts, and document names from issue reports. Record chip/RAM, macOS, `ollama --version`, and your Open WebUI version.

## Stop or undo this guide’s login services

To stop a service now, run the matching command on its Mac:

```sh
# Pro
launchctl bootout gui/$(id -u)/org.headlessmac.ollama
launchctl bootout gui/$(id -u)/org.headlessmac.webui
# Air
launchctl bootout gui/$(id -u)/org.headlessmac.webui-tunnel
launchctl bootout gui/$(id -u)/org.headlessmac.terminal-login
```

A missing optional service may return an error. To keep a service disabled on future logins, move its matching `org.headlessmac.*.plist` file out of `~/Library/LaunchAgents` using Finder → Go → Go to Folder. Preserve your data and secrets. The installer’s `.backup-*` files contain prior versions if you need to restore a configuration. Do not remove unrelated launch services.
