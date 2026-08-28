import re, pathlib

ROOT = pathlib.Path(".")
VER = "20260814u"
# match href/src of local css/*.css or js/*.js (with optional ../ prefixes),
# stripping any pre-existing ?v=... query so we can re-stamp.
pat = re.compile(r'((?:href|src)=")((?:\.\./)*(?:css|js)/[A-Za-z0-9_.-]+\.(?:css|js))(\?v=[^"]*)?(")')

changed = []
for f in ROOT.rglob("*.html"):
    if "/.git/" in f.as_posix():
        continue
    txt = f.read_text(encoding="utf-8", errors="ignore")
    new = pat.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={VER}{m.group(4)}', txt)
    if new != txt:
        f.write_text(new, encoding="utf-8")
        changed.append(f.as_posix())

print(f"stamped v={VER} on {len(changed)} files")
for c in changed:
    print(" ", c)
