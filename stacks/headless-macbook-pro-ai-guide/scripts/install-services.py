#!/usr/bin/env python3
"""Preview or install per-user macOS services; Python 3.9+, standard library only.

This does not download software, enable SSH, edit SSH keys, or change global
power settings. Use --apply to write files, and --load to start the services.
"""
import argparse
import os
from pathlib import Path
import plistlib
import re
import secrets
import shlex
import shutil
import socket
import subprocess
import sys
from datetime import datetime

PREFIX = 'org.headlessmac'
HERE = Path(__file__).resolve().parent


def alias(value):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', value):
        raise argparse.ArgumentTypeError('Use a configured SSH alias such as pro.')
    return value


def executable(explicit, candidates):
    for item in ([explicit] if explicit else []) + candidates:
        if not item:
            continue
        path = Path(item).expanduser()
        if path.is_file() and os.access(path, os.X_OK):
            return str(path.absolute())
    raise ValueError('Required program not found. Install it first or supply its full path.')


def launch_agent(home, label, args, env=None, keepalive=True):
    data = {
        'Label': label, 'ProgramArguments': args, 'RunAtLoad': True,
        'KeepAlive': keepalive, 'ThrottleInterval': 10,
        'LimitLoadToSessionType': 'Aqua', 'WorkingDirectory': str(home),
        'StandardOutPath': str(home / 'Library/Logs' / (label + '.log')),
        'StandardErrorPath': str(home / 'Library/Logs' / (label + '.error.log')),
    }
    if env:
        data['EnvironmentVariables'] = env
    return plistlib.dumps(data)


def server_plan(home, ollama, webui, secret, offline=False):
    state = home / '.local/share/headless-ai'
    env = {
        'DATA_DIR': str(state / 'open-webui'),
        'WEBUI_SECRET_KEY': secret,
        'WEBUI_AUTH': 'True',
        'OLLAMA_BASE_URL': 'http://127.0.0.1:11434',
        'ENABLE_OPENAI_API': 'False',
        'ENABLE_WEB_SEARCH': 'False',
        'OFFLINE_MODE': 'True' if offline else 'False',
    }
    if offline:
        env['HF_HUB_OFFLINE'] = '1'
    return {
        home / 'Library/LaunchAgents' / (PREFIX + '.ollama.plist'):
            (launch_agent(home, PREFIX + '.ollama',
                ['/usr/bin/caffeinate', '-s', ollama, 'serve'], {
                    'OLLAMA_HOST': '127.0.0.1:11434', 'OLLAMA_NO_CLOUD': '1',
                    'OLLAMA_MAX_LOADED_MODELS': '1', 'OLLAMA_NUM_PARALLEL': '1',
                    'OLLAMA_CONTEXT_LENGTH': '2048',
                }), 0o600),
        home / 'Library/LaunchAgents' / (PREFIX + '.webui.plist'):
            (launch_agent(home, PREFIX + '.webui',
                [webui, 'serve', '--host', '127.0.0.1', '--port', '8080'], env), 0o600),
        state / 'webui-secret': ((secret + '\n').encode(), 0o600),
    }


def client_plan(home, host, terminal_login=False):
    result = {
        home / 'Library/LaunchAgents' / (PREFIX + '.webui-tunnel.plist'):
            (launch_agent(home, PREFIX + '.webui-tunnel', [
                '/usr/bin/ssh', '-N', '-T', '-o', 'BatchMode=yes',
                '-o', 'StrictHostKeyChecking=yes', '-o', 'ExitOnForwardFailure=yes',
                '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3',
                '-o', 'ConnectTimeout=8', '-L', '127.0.0.1:18080:127.0.0.1:8080',
                host,
            ]), 0o600),
        home / 'Desktop/Local AI.webloc':
            (plistlib.dumps({'URL': 'http://127.0.0.1:18080'}), 0o600),
    }
    for name in ('pro-chat', 'pro-webui'):
        result[home / '.local/bin' / name] = ((HERE / name).read_bytes(), 0o700)
    if terminal_login:
        result[home / 'Library/LaunchAgents' / (PREFIX + '.terminal-login.plist')] = (
            launch_agent(home, PREFIX + '.terminal-login',
                ['/usr/bin/open', '-a', 'Terminal'], keepalive=False), 0o600)
    return result


def write_plan(plan, replace=False):
    # Validate the entire plan before writing anything.
    for path, (content, _) in plan.items():
        if path.is_symlink():
            raise ValueError('Refusing to overwrite symlink: ' + str(path))
        if path.exists() and path.read_bytes() != content and not replace:
            raise ValueError('Existing file differs; review it, then use --replace: ' + str(path))
    stamp = datetime.now().strftime('%Y%m%d-%H%M%S-%f')
    for path, (content, mode) in plan.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists() and path.read_bytes() != content:
            shutil.copy2(path, path.with_name(path.name + '.backup-' + stamp))
        if not path.exists() or path.read_bytes() != content:
            temp = path.with_name(path.name + '.tmp-' + str(os.getpid()))
            # Exclusive creation prevents following an existing temporary symlink.
            with temp.open('xb') as output:
                os.chmod(temp, mode)
                output.write(content)
            os.replace(temp, path)
        os.chmod(path, mode)


def check_ports(plan, mode):
    checks = [(11434, PREFIX + '.ollama'), (8080, PREFIX + '.webui')] if mode == 'server' else [(18080, PREFIX + '.webui-tunnel')]
    for port, label in checks:
        with socket.socket() as probe:
            probe.settimeout(1)
            busy = probe.connect_ex(('127.0.0.1', port)) == 0
        owned = subprocess.run(['/bin/launchctl', 'print', 'gui/' + str(os.getuid()) + '/' + label],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
        if busy and not owned:
            raise ValueError(f'Port {port} is already in use by another service. Stop that service yourself before --load.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['server', 'client'])
    parser.add_argument('--host', type=alias, default='pro')
    parser.add_argument('--ollama', help='Full path to installed ollama executable')
    parser.add_argument('--webui', help='Full path to installed open-webui executable')
    parser.add_argument('--offline', action='store_true', help='Server: use after pre-downloading required models/caches')
    parser.add_argument('--terminal-login', action='store_true', help='Client: also open Terminal at login; configure its window group manually')
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--replace', action='store_true', help='Back up and replace differing files owned by this installer')
    parser.add_argument('--load', action='store_true', help='Start/restart generated LaunchAgents; requires --apply')
    args = parser.parse_args()
    if args.load and not args.apply:
        parser.error('--load requires --apply')
    if sys.platform != 'darwin':
        parser.error('This installer is for macOS. Tests can run on other systems.')
    home = Path.home()
    if args.mode == 'server':
        ollama = executable(args.ollama, [shutil.which('ollama'),
            str(home / '.local/bin/ollama'), '/Applications/Ollama.app/Contents/Resources/ollama',
            str(home / 'Applications/Ollama.app/Contents/Resources/ollama')])
        webui = executable(args.webui, [shutil.which('open-webui'), str(home / '.local/bin/open-webui')])
        secret_path = home / '.local/share/headless-ai/webui-secret'
        if secret_path.is_symlink():
            raise ValueError('Refusing secret-file symlink.')
        secret = secret_path.read_text().strip() if secret_path.exists() else secrets.token_urlsafe(48)
        if not secret:
            raise ValueError('Existing WebUI secret is empty; inspect it before proceeding.')
        plan = server_plan(home, ollama, webui, secret, args.offline)
    else:
        plan = client_plan(home, args.host, args.terminal_login)
    for path, (_, mode) in plan.items():
        print(('WRITE' if args.apply else 'PREVIEW'), oct(mode), path)
    if not args.apply:
        print('No files changed. Add --apply to save; add --load to start them.')
        return
    if args.load:
        check_ports(plan, args.mode)
    (home / 'Library/Logs').mkdir(parents=True, exist_ok=True)
    if args.mode == 'server':
        (home / '.local/share/headless-ai/open-webui').mkdir(parents=True, exist_ok=True, mode=0o700)
    write_plan(plan, args.replace)
    for path in plan:
        if path.parent.name != 'LaunchAgents':
            continue
        if args.load:
            target = 'gui/' + str(os.getuid())
            subprocess.run(['/bin/launchctl', 'bootout', target + '/' + path.stem],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['/bin/launchctl', 'bootstrap', target, str(path)], check=True)
        else:
            print('Start with:', shlex.join(['/bin/launchctl', 'bootstrap', 'gui/' + str(os.getuid()), str(path)]))
    print('Saved. These are user login services; a cold boot still requires macOS login.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print('Error:', error, file=sys.stderr)
        sys.exit(1)
