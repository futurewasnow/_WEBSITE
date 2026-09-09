# -*- coding: utf-8 -*-
"""Rebuild the YouSee360 logo + favicon assets from the master brand artwork.

The master file is the vector lockup exported from Illustrator:

    D:/YouSee360/Logos/PNG/SVG/Asset 92.svg

It stacks three pieces on a black background rect -- the spiral mark, the
YOUSEE360 wordmark and the "VIRTUAL TOUR AGENCY" tagline. This script splits
those apart, drops the background, and re-lays them out into the shapes the
site actually needs (a horizontal nav lockup, a mark on its own, a stacked
lockup) plus the full favicon/app-icon set.

Rasterisation runs through a headless-ish trick: the SVGs are drawn onto a
canvas by the browser during `_build_brand_raster.html`. The PNG/ICO writing
here uses Pillow on those captures. Run `python _build_brand.py` to redo the
vectors, then the raster step.

Usage:  python _build_brand.py
"""
import io
import os
import re

SRC = r'D:\YouSee360\Logos\PNG\SVG\Asset 92.svg'
OUT = 'images'

# Bounding boxes of the three pieces, measured with getBBox() against the
# master's own viewBox ("0 0 1580.6 1530.71").
BB = {
    'tag':  (184.46, 1334.71, 1211.02, 93.39),
    'word': (184.47, 1047.56, 1211.00, 150.78),
    'mark': (453.95, 154.92, 725.81, 726.69),
}

# Every stroked ring in the mark inherits a default black fill from the master,
# which only looked right because of the background rect. Null them all so the
# artwork is genuinely transparent.
NO_FILL = ','.join('.cls-%d' % n for n in range(1, 15)) + '{fill:none}'


def load_master():
    s = io.open(SRC, encoding='utf-8').read()
    defs = s[s.find('<defs>'):s.find('</defs>') + 7]
    body = s[s.find('<g id="Layer_1-2"'):s.rfind('</svg>')]
    inner = body[body.find('>') + 1: body.rfind('</g>')]

    groups, depth, start, i = [], 0, None, 0
    while i < len(inner):
        if inner.startswith('<g', i) and inner[i + 2] in ' >':
            if depth == 0:
                start = i
            depth += 1
        elif inner.startswith('</g>', i):
            depth -= 1
            if depth == 0:
                groups.append(inner[start:i + 4])
        i += 1
    if len(groups) != 3:
        raise SystemExit('expected 3 groups in master artwork, found %d' % len(groups))
    tag, word, mark = groups
    return defs, tag, word, mark


def thicken(defs, factor):
    """Fatten the mark's hairlines so it survives being shrunk to 16-32px."""
    def bump(m):
        return 'stroke-width: %.2fpx' % (float(m.group(1)) * factor)
    out = re.sub(r'stroke-width:\s*([\d.]+)px', bump, defs)
    # the faintest rings disappear entirely once downscaled -- lift them
    out = re.sub(r'opacity:\s*\.2;', 'opacity: .55;', out)
    out = re.sub(r'opacity:\s*\.4;', 'opacity: .7;', out)
    out = re.sub(r'opacity:\s*\.6;', 'opacity: .85;', out)
    return out


def place(group, key, scale, tx, ty):
    bx, by = BB[key][0], BB[key][1]
    return ('<g transform="translate(%.4f,%.4f) scale(%.6f) translate(%.4f,%.4f)">%s</g>'
            % (tx, ty, scale, -bx, -by, group))


def svg(w, h, parts, label, defs, style=NO_FILL, extra=''):
    return ('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
            ' viewBox="0 0 %.2f %.2f" role="img" aria-label="%s">\n'
            '<title>%s</title>\n%s\n<style>%s</style>\n%s%s\n</svg>\n'
            % (w, h, label, label, defs, style, extra, '\n'.join(parts)))


def write(name, text):
    path = os.path.join(OUT, name)
    io.open(path, 'w', encoding='utf-8').write(text)
    print('  %-38s %6d bytes' % (name, os.path.getsize(path)))


def main():
    defs, g_tag, g_word, g_mark = load_master()
    if not os.path.isdir(OUT):
        raise SystemExit('run this from the site root (no %s/ here)' % OUT)

    print('brand vectors:')

    # --- horizontal nav lockup: mark + wordmark ----------------------------
    mark_h, word_h, gap = 300.0, 130.0, 66.0
    s_mark = mark_h / BB['mark'][3]
    w_mark = BB['mark'][2] * s_mark
    s_word = word_h / BB['word'][3]
    w_word = BB['word'][2] * s_word
    total_w = w_mark + gap + w_word
    lockup = [place(g_mark, 'mark', s_mark, 0, 0),
              place(g_word, 'word', s_word, w_mark + gap, (mark_h - word_h) / 2.0)]

    write('logo-yousee360-lockup.svg',
          svg(total_w, mark_h, lockup, 'YouSee360', defs))
    # on light backgrounds the white "360" would vanish
    write('logo-yousee360-lockup-dark.svg',
          svg(total_w, mark_h, lockup, 'YouSee360', defs,
              style=NO_FILL + '.cls-15{fill:#0b1114}'))

    # --- mark on its own ---------------------------------------------------
    mark_only = [place(g_mark, 'mark', 1.0, 0, 0)]
    write('logo-yousee360-mark.svg',
          svg(BB['mark'][2], BB['mark'][3], mark_only, 'YouSee360', defs))

    # --- favicon: thickened mark on the brand's black rounded square -------
    fat = thicken(defs, 3.2)
    pad = 78.0
    side = BB['mark'][2] + pad * 2
    plate = ('<rect width="%.2f" height="%.2f" rx="%.2f" fill="#07090b"/>'
             % (side, side, side * 0.22))
    write('favicon.svg',
          svg(side, side,
              [place(g_mark, 'mark', 1.0, pad, pad + (BB['mark'][2] - BB['mark'][3]) / 2.0)],
              'YouSee360', fat, extra=plate))
    # maskable / apple-touch want the art inset inside a full-bleed plate
    pad2 = BB['mark'][2] * 0.30
    side2 = BB['mark'][2] + pad2 * 2
    write('icon-maskable.svg',
          svg(side2, side2,
              [place(g_mark, 'mark', 1.0, pad2, pad2 + (BB['mark'][2] - BB['mark'][3]) / 2.0)],
              'YouSee360', thicken(defs, 2.0),
              extra='<rect width="%.2f" height="%.2f" fill="#07090b"/>' % (side2, side2)))

    # --- stacked lockup with tagline (footer, share cards) -----------------
    sw = BB['word'][2]
    m_h = 640.0
    s_m2 = m_h / BB['mark'][3]
    w_m2 = BB['mark'][2] * s_m2
    stack_top = m_h + 70
    stack_h = (BB['tag'][1] + BB['tag'][3]) - BB['word'][1]
    stacked = [place(g_mark, 'mark', s_m2, (sw - w_m2) / 2.0, 0),
               place(g_word, 'word', 1.0, 0, stack_top),
               place(g_tag, 'tag', 1.0, 0, stack_top + (BB['tag'][1] - BB['word'][1]))]
    write('logo-yousee360-stacked.svg',
          svg(sw, stack_top + stack_h, stacked, 'YouSee360 - Virtual Tour Agency', defs))

    print('\n  nav lockup aspect ratio: %.3f (%.0f x %.0f)' % (total_w / mark_h, total_w, mark_h))


if __name__ == '__main__':
    main()
