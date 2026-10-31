"""Re-stamp ?v= on specific shared assets across every page (narrow version of _cachebust.py).
Usage: python _bump_assets.py VERSION path/one.css path/two.js ..."""
import re, sys, pathlib
ver, files = sys.argv[1], sys.argv[2:]
changed = 0
for f in pathlib.Path('.').rglob('*.html'):
    p = f.as_posix()
    if any(s in p for s in ('/.git/', '_DEPLOY/', '_REUPLOAD/', 'yousee360-round5/', 'node_modules/', 'output/', 'tmp/')):
        continue
    txt = f.read_text(encoding='utf-8', errors='ignore')
    new = txt
    for a in files:
        new = re.sub(r'((?:href|src)="(?:\.\./|/)*' + re.escape(a) + r')(\?v=[^"]*)?"', r'\1?v=' + ver + '"', new)
    if new != txt:
        f.write_text(new, encoding='utf-8'); changed += 1
print('stamped', ver, 'on', changed, 'pages')
