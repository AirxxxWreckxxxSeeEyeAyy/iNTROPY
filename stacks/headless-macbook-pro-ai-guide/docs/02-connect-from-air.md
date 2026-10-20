# 2. Connect from the MacBook Air

The **Pro runs the models**. The **Air runs your browser and remote terminal**. The Air can be another Mac; it does not need the model files.

## A. Turn on Remote Login on the Pro

On the **Pro**, open System Settings → General → Sharing → Remote Login. Enable it only for the account you intend to use. Record the SSH command/address macOS displays. Record your Pro account’s short username, not its full display name. [Apple’s Remote Login guide](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)

In the Pro’s Terminal, display its host-key fingerprint:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

## B. Make the first connection

In **Air Terminal**, replace the example username and hostname with yours:

```sh
ssh YOUR_PRO_USERNAME@YOUR_PRO_HOSTNAME.local
```

Compare the displayed fingerprint to the one you read on the Pro. Accept it only when they match, then enter your **Pro account password**. If you see a changed-key warning on a previously used server, investigate it instead of disabling host-key checking.

Check which computer you reached:

```sh
hostname
```

It should identify the Pro. Type `exit` to return to the Air. If `.local` does not resolve, use the Pro’s current local IP from System Settings → Network; an old saved IP may have changed.

## C. Set up a dedicated SSH key

On the **Air**, check whether the proposed key name already exists:

```sh
ls ~/.ssh/id_ed25519_headless_pro*
```

If it exists, reuse it or choose a new filename. Do not overwrite a working key. If it does not exist:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_headless_pro -C 'air-to-headless-pro'
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_headless_pro
```

Use a passphrase. The second command lets macOS Keychain supply it to SSH. Copy **only the public key** to the Pro. Replace the example login in this **Air** command:

```sh
cat ~/.ssh/id_ed25519_headless_pro.pub | ssh YOUR_PRO_USERNAME@YOUR_PRO_HOSTNAME.local 'umask 077; mkdir -p ~/.ssh; touch ~/.ssh/authorized_keys; chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys; printf "\n" >> ~/.ssh/authorized_keys; cat >> ~/.ssh/authorized_keys'
```

This appends to the existing authorized keys. The private key is the file **without** `.pub`; leave it on the Air.

Edit `~/.ssh/config` on the **Air**, preserving any existing entries. Add this block **before a general `Host *` block**, substituting your own details:

```sshconfig
Host pro
    HostName YOUR_PRO_HOSTNAME.local
    User YOUR_PRO_USERNAME
    IdentityFile ~/.ssh/id_ed25519_headless_pro
    IdentitiesOnly yes
    AddKeysToAgent yes
    IgnoreUnknown UseKeychain
    UseKeychain yes
    StrictHostKeyChecking yes
    ServerAliveInterval 30
    ServerAliveCountMax 3
    ConnectTimeout 8
```

If `Host pro` already exists, update that block rather than adding a competing one. Test from the **Air**:

```sh
ssh -o BatchMode=yes pro hostname
```

Proceed when it prints the Pro’s hostname without asking for an account password. A successful interactive password login alone is not enough for an unattended startup tunnel.

## D. Install the Air’s browser connection

Download/unzip this repository on the **Air** as well. Open Terminal in its `stacks/headless-macbook-pro-ai-guide` folder. If `python3 --version` works, preview the client setup:

```sh
python3 scripts/install-services.py client
```

If Python is missing, install `uv` using the official command in the server chapter, then use `~/.local/bin/uv run --python 3.11` instead of `python3` in these commands. Preview first, then save and start:

```sh
python3 scripts/install-services.py client --apply --load
```

This creates a background SSH tunnel at login and a **Local AI** shortcut on the Air’s Desktop. Open the shortcut, or visit **http://127.0.0.1:18080** on the Air. The browser talks through SSH to Open WebUI on the Pro. The Pro’s web/API ports stay on loopback; no router port forwarding is needed.

You can now close the setup Terminal. The background tunnel retries after connection failures. If the Air sleeps or leaves the local network, the tunnel will become available again after it wakes and can reach the Pro.

For a temporary connection instead of a login service, run `bash scripts/pro-webui pro` from the Air’s repository folder and leave that Terminal open. Do not run both tunnel methods on the same local port.

## E. Optional persistent model terminal

The client installer also adds `~/.local/bin/pro-chat`. In **Air Terminal**:

```sh
~/.local/bin/pro-chat pro gemma3:4b
```

At `>>>`, type your message. To leave the session running, press **Ctrl-A**, release both keys, then press **D**. Run the same command later to return to it. `/bye` exits that chat program; detaching keeps it alive.

For another downloaded model:

```sh
~/.local/bin/pro-chat pro llama3.2:3b
~/.local/bin/pro-chat pro qwen3:4b
```

Run one command at a time. The helper uses a separate `screen` session for each model tag, checks that the model is already available, and retries SSH transport failures. It prevents idle sleep on both Macs while the session is active; see [power behavior](04-startup-and-power.md).

Terminal chat and browser chat are separate conversation histories. Reconnecting a terminal does not import its conversation into Open WebUI.
