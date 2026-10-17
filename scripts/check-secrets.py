#!/usr/bin/env python3
"""Check publishable files without printing credential values. Not a full security audit."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {'.git', 'node_modules', 'dist', 'build', 'coverage', '.aistudio', '.gmp_cache', '.vercel', '.netlify'}
PATTERNS = {
    'Google API key': r'AI' + r'za[0-9A-Za-z_-]{35}',
    'GitHub token': r'gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}',
    'provider secret key': r'\bsk-[A-Za-z0-9_-]{20,}',
    'AWS access key': r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b',
    'private key': r'-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----',
    'JWT token': r'\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}',
    'URL credentials': r'[a-z]+://[^\s/:]+:[^\s/@]+@',
}
BINARY = {'.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.pdf'}

def candidates():
    probe = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', '--show-toplevel'], capture_output=True, text=True)
    if probe.returncode == 0 and Path(probe.stdout.strip()).resolve() == ROOT:
        # Include staged/tracked files even if someone later adds them to .gitignore.
        result = subprocess.run(['git', '-C', str(ROOT), 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], capture_output=True, check=True)
        return [ROOT / name.decode() for name in result.stdout.split(b'\0') if name]
    return [p for p in ROOT.rglob('*') if p.is_file()
            and not any(part in SKIP for part in p.relative_to(ROOT).parts)
            and (not p.name.startswith('.env') or p.name == '.env.example')]

findings = []
for path in candidates():
    rel = path.relative_to(ROOT)
    if path.name.startswith('.env') and path.name != '.env.example':
        findings.append((rel, 0, 'private environment file selected for publication'))
        continue
    if path.suffix in {'.pem', '.key', '.p12', '.pfx', '.keystore'} or path.name == '.npmrc':
        findings.append((rel, 0, 'credential-bearing file selected for publication'))
        continue
    if path.suffix.lower() in BINARY or not path.is_file():
        continue
    try:
        content = path.read_text()
    except (UnicodeError, OSError):
        continue
    for number, line in enumerate(content.splitlines(), 1):
        for label, pattern in PATTERNS.items():
            if re.search(pattern, line):
                findings.append((rel, number, label))
if findings:
    for path, number, label in findings:
        print(f'{path}:{number}: {label} [value redacted]')
    print(f'FAIL: {len(findings)} potential secret(s). Do not publish until reviewed.')
    sys.exit(1)
print('PASS: no configured secret patterns found in publishable text files.')
print('Also review git diff --cached, images, unusual token formats, and any existing Git history.')
