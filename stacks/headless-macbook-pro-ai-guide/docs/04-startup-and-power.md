# 4. Startup, persistent tabs, and screen-off behavior

## What starts when

| Event | Expected behavior |
| --- | --- |
| Pro user logs in | The installed Ollama and Open WebUI LaunchAgents start |
| Air user logs in | The SSH browser tunnel starts and retries if the Pro is unavailable |
| Pro display turns off | Services can continue while the computer remains awake |
| Wi-Fi drops briefly | The browser tunnel retries; terminal helper reconnects to its screen session |
| Pro reboots | Running screen sessions end; log in to the Pro again before user services start |
| Air sleeps | Its SSH connection can stop; reconnect after wake and network recovery |

A login service is not a boot service. A cold boot, FileVault unlock, lid closure, or battery exhaustion can require physical access. Keep the Pro on AC with its lid open for this beta.

## Optional Air Codex and Pro Gemma tabs

The browser works without these tabs. They recreate the author’s workstation layout for people who also want a local coding assistant and a remote model prompt.

1. On the Air, open Terminal → Settings → Profiles. Duplicate a profile and name it **Air - Codex**. In its Shell settings, set its startup command to the full path of your existing Codex launcher, or open your project folder and run `codex` manually. Codex installation/sign-in is separate: [official CLI instructions](https://developers.openai.com/codex/cli/). Codex access is not required for local model chat and is not covered by this guide’s offline claim.
2. Duplicate another profile named **Pro - Gemma**. Set its Shell startup command to the full path of `~/.local/bin/pro-chat pro gemma3:4b`. In a setting that does not expand `~`, use `/Users/YOUR_AIR_USERNAME/.local/bin/pro-chat pro gemma3:4b`.
3. Open one window with these two profiles as tabs. From Terminal’s Window menu, save a window group named **Air Codex and Pro Gemma**. Enable restoring commands where offered and select the group for Terminal startup. Use this exact group name when selecting it; imported group names may follow the filename.
4. On the Air, preview and then install the optional login launcher from the guide folder:

```sh
python3 scripts/install-services.py client --terminal-login
python3 scripts/install-services.py client --terminal-login --apply --replace --load
```

Use the Python/uv fallback from chapter 2 if needed. This opens Terminal at login; Terminal’s own saved window group supplies the tabs. It does not configure the profiles automatically. Avoid adding a second competing Terminal login item. [Apple’s window-group instructions](https://support.apple.com/en-ca/guide/terminal/trml15652/mac)

Test the saved group by opening it from Terminal’s Window menu, then test an Air logout/login when convenient. Existing running Terminal windows can affect what is restored. The reference user confirmed both tabs opened; a fresh-login acceptance test of these portable instructions remains pending.

## Keep the display dark while the server stays awake

The server helper wraps Ollama in `caffeinate -s`, which prevents system sleep while on AC power. It does not prevent display sleep. The optional terminal helper uses `caffeinate -i` while active; this can keep a Mac awake on battery too, so detach/exit when finished and keep the server plugged in.

Alternatively, macOS offers a setting to prevent automatic sleeping on the power adapter when the display is off. [Apple power settings](https://support.apple.com/en-gb/guide/mac-help/-mchle41a6ccd/mac)

The original Pro had AC sleep disabled. You can inspect settings with `pmset -g custom`; this guide’s installer does not change them. Keep ventilation clear. Lid-closed operation is not tested here and is not guaranteed by a keepalive or `caffeinate` assertion.

## Check your own screen-off connection

From **Air Terminal**, run:

```sh
ssh pro 'pmset displaysleepnow; for n in 1 2 3 4 5 6; do sleep 10; date; done'
```

The Pro display should go dark while timestamps continue through the same SSH connection. Avoid touching the Pro during the check. Afterwards, open the Air’s Local AI shortcut and generate a reply. Record the result; a minute-long check does not establish overnight reliability.

On the reference setup, SSH stayed connected during a 90-second test that included a final verified display-off interval of about 46 seconds. The same Gemma screen session survived reconnecting. See the [test record](tested-configuration.md) for limitations.
