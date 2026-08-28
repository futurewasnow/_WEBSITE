# -*- coding: utf-8 -*-
"""Rebuild the CSS bundles in css/ from their source files.

The site's pages load content-hashed bundles (css/bundle-<hash>.css) rather than
the individual stylesheets. Each bundle records the exact ordered list of source
files it was built from in its header comment, so editing any css/*.css means
re-running this script -- otherwise the edit never reaches the browser.

Usage:  python _rebuild_bundles.py
"""
import glob
import hashlib
import io
import os
import re

HEADER = re.compile(
    r'/\*!\s*YouSee360 CSS bundle\s*[^\n]*\n(?P<list>(?:\s*\*\s*[^\n]+\n)+?)\s*\*/',
    re.S)


def sources_of(bundle_path):
    """Read the ordered source list out of a bundle's header comment."""
    head = io.open(bundle_path, encoding='utf-8', errors='replace').read(4000)
    m = HEADER.search(head)
    if not m:
        return None
    out = []
    for line in m.group('list').splitlines():
        name = line.strip().lstrip('*').strip()
        if name.lower().endswith('.css'):
            out.append(name)
    return out or None


def build(sources):
    parts = []
    for fn in sources:
        p = os.path.join('css', fn)
        if not os.path.exists(p):
            raise SystemExit('missing source stylesheet: %s' % p)
        parts.append('/* ===== %s ===== */\n' % fn
                     + io.open(p, encoding='utf-8', errors='replace').read())
    body = '\n'.join(parts)
    digest = hashlib.sha1(body.encode('utf-8')).hexdigest()[:8]
    header = ('/*! YouSee360 CSS bundle — %d files, exact concatenation of:\n * %s\n */\n'
              % (len(sources), '\n * '.join(sources)))
    return header + body, digest


def main():
    bundles = sorted(glob.glob('css/bundle-*.css'))
    if not bundles:
        raise SystemExit('no bundles found in css/')

    html = [f.replace(os.sep, '/') for f in glob.glob('**/*.html', recursive=True)
            if '.git' not in f]
    renames = {}
    unchanged = 0

    for path in bundles:
        old_name = os.path.basename(path)
        srcs = sources_of(path)
        if not srcs:
            print('  SKIP (no source header): %s' % old_name)
            continue
        content, digest = build(srcs)
        new_name = 'bundle-%s.css' % digest
        io.open(os.path.join('css', new_name), 'w', encoding='utf-8').write(content)
        if new_name != old_name:
            renames[old_name] = new_name
            os.remove(path)
            print('  rebuilt %s -> %s  (%d sources)' % (old_name, new_name, len(srcs)))
        else:
            unchanged += 1

    if not renames:
        print('  all %d bundles unchanged' % unchanged)
        return

    touched = 0
    for f in html:
        s = io.open(f, encoding='utf-8').read()
        o = s
        for old, new in renames.items():
            s = s.replace(old + '?v=' + old[7:15], new + '?v=' + new[7:15])
            s = s.replace(old, new)
        if s != o:
            io.open(f, 'w', encoding='utf-8').write(s)
            touched += 1
    print('  %d bundles rebuilt, %d unchanged, %d HTML files re-pointed'
          % (len(renames), unchanged, touched))


if __name__ == '__main__':
    main()
