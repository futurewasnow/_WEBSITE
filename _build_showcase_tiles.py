# -*- coding: utf-8 -*-
"""Showcase 360 hero scenes from local equirectangular panoramas.

Reads the stitched masters listed in SCENES (never modified) and writes
  images/panoramas/tiles/<key>/   Pannellum multires pyramids (strict halving) + fallback faces
and records each scene in images/panoramas/tiles/sources.json.

Each equirect is remapped to six cube faces at width/4 (OpenCV, Lanczos), so nothing is
upscaled: a 12k master gives 3000 px faces, a 15k master 3749 px. The top level is WebP q82,
lower levels q78 (as in _build_elsalto.py). Provenance keeps the source path and its SHA-256
so tests/hero-tiles.py can confirm the master is unchanged.

Usage:  python _build_showcase_tiles.py [key ...]      (no keys = every scene not yet built)
"""
import hashlib
import json
import math
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

OUT = Path('images/panoramas/tiles')
KRUGER = 'G:/Kruger Family Trip/_tour/masters/{}-color-v1.jpg'
SCENES = [  # key, source panorama, label (provenance only; captions live in js/hero-demos.js)
    ('genio-sunset', 'D:/YouSee360/El Genio/Drone 360/[Group 0]-PANO0001_PANO0025-25 images sunset.jpg', 'El Genio shoot, drone 360 at sunset over the lake'),
    ('genio-lake', 'D:/YouSee360/El Genio/Drone 360/[Group 0]-PANO0001_PANO0025-25 images edited.jpg', 'El Genio shoot, drone 360 by day over the lake'),
    ('oasis-aerial', 'D:/YouSee360/360 Photos/Arenal Oasis/drone above center.jpg', 'Arenal Oasis, drone 360 above the dome with Arenal volcano'),
    ('cove-dusk', KRUGER.format('9a5fc93c063d0427'), 'Costa Rica trip, resort cove at dusk from the drone (third-party resort, capture example)'),
    ('thermal-pools', KRUGER.format('0fa2ade5035d2d22'), 'Costa Rica trip, thermal pools (ground 360, venue unverified, capture example)'),
    ('thermal-trees', KRUGER.format('f53fc9900c80d47d'), 'Costa Rica trip, thermal pools under trees (ground 360, venue unverified, capture example)'),
    ('waterfall-canyon', KRUGER.format('794562c053716a4b'), 'Costa Rica trip, waterfall canyon from the drone (capture example)'),
    ('hanging-bridge', KRUGER.format('088a819b9c42dda8'), 'Costa Rica trip, hanging bridge in the rainforest (ground 360, capture example)'),
    ('tortuga-rocks', KRUGER.format('7b721ce274e58207'), 'Costa Rica trip, Isla Tortuga rock formations from the drone (capture example)'),
    ('twin-coves', KRUGER.format('e63eb25af9809ed6'), 'Costa Rica trip, twin coves from the drone (capture example)'),
    ('jobo-cove', KRUGER.format('1931f8fca3bafbd0'), 'Costa Rica trip, Playa El Jobo cove from the drone (third-party resort in frame, capture example)'),
    ('sunset-bay', KRUGER.format('652a20d648b015ae'), 'Costa Rica trip, sunset over the bay from the drone (capture example)'),
    ('lodge-overlook', KRUGER.format('be94e820b0767489'), 'Costa Rica trip, mountain lodge overlook from the drone (third-party lodge, capture example)'),
]
TOP_Q = 82
LOWER_Q = 78
FACES = 'fbrlud'
cv2.setNumThreads(4)


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def cube_faces(img, face):
    """Six Pannellum faces (f +z, b -z, r +x, l -x, u +y, d -y); yaw 0 looks at the equirect centre."""
    H, W = img.shape[:2]
    pad = 8  # wrap the horizontal seam by hand so the vertical border can reflect instead of wrapping
    padded = np.hstack([img[:, -pad:], img, img[:, :pad]])
    u = (np.arange(face, dtype=np.float32) + 0.5) / face * 2 - 1
    a, b = np.meshgrid(u, u)
    one = np.ones_like(a)
    vectors = {'f': (a, -b, one), 'b': (-a, -b, -one), 'r': (one, -b, -a), 'l': (-one, -b, a), 'u': (a, one, b), 'd': (a, -one, -b)}
    out = {}
    for name, (x, y, z) in vectors.items():
        lon = np.arctan2(x, z)
        lat = np.arctan2(y, np.sqrt(x * x + z * z))
        mx = ((lon / (2 * np.pi) + 0.5) * W - 0.5 + pad).astype(np.float32)
        my = ((0.5 - lat / np.pi) * H - 0.5).astype(np.float32)
        out[name] = cv2.remap(padded, mx, my, cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT_101)
    return out


def build(key, source, label):
    dest = OUT / key
    src = Path(source)
    digest = sha256(src)
    t0 = time.time()
    img = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f'cannot read {src}')
    H, W = img.shape[:2]
    size = W // 4
    max_level = math.ceil(math.log2(size / 512)) + 1
    prov = dict(projection='cubemap', sourceFile=str(src), sourceSha256=digest, sourceSize=[W, H],
                sourceProjection='equirectangular', sourceLabel=label,
                derivation='six cube faces at width/4 by OpenCV Lanczos4 remap (_build_showcase_tiles.py), no upscaling',
                cubeResolution=size, tileResolution=512, maxLevel=max_level, extension='webp',
                topLevel=f'WebP q{TOP_Q}', lowerLevels=f'WebP q{LOWER_Q}')
    if (dest / 'source.json').exists() and json.loads((dest / 'source.json').read_text()) == prov:
        print('already built', key, flush=True)
        return prov
    print('building', key, W, 'x', H, '->', size, 'px/face, levels', max_level, flush=True)
    faces = cube_faces(img, size)
    del img
    print('  faces', key, round(time.time() - t0, 1), 's', flush=True)

    def one_face(face):
        full = Image.fromarray(cv2.cvtColor(faces[face], cv2.COLOR_BGR2RGB))
        for number in range(max_level, 0, -1):
            width = math.floor(size / 2 ** (max_level - number))
            level = full if width == size else full.resize((width, width), Image.Resampling.LANCZOS)
            lf = dest / str(number)
            lf.mkdir(parents=True, exist_ok=True)
            for y in range(math.ceil(width / 512)):
                for x in range(math.ceil(width / 512)):
                    level.crop((x * 512, y * 512, min((x + 1) * 512, width), min((y + 1) * 512, width))).save(
                        lf / f'{face}{y}_{x}.webp', quality=TOP_Q if number == max_level else LOWER_Q, method=4)
        fb = dest / 'fallback'
        fb.mkdir(parents=True, exist_ok=True)
        small = full.resize((1024, 1024), Image.Resampling.LANCZOS)
        small.save(fb / f'{face}.jpg', quality=90)
        small.save(fb / f'{face}.webp', quality=90, method=4)
        return face

    with ThreadPoolExecutor(max_workers=3) as pool:
        for f in pool.map(one_face, FACES):
            print('  ', key, f, round(time.time() - t0, 1), 's', flush=True)
    (dest / 'source.json').write_text(json.dumps(prov, indent=2))
    return prov


def main(keys):
    manifest_path = OUT / 'sources.json'
    manifest = json.loads(manifest_path.read_text())
    for key, source, label in SCENES:
        if keys and key not in keys:
            continue
        manifest[key] = build(key, source, label)
        manifest_path.write_text(json.dumps(manifest, indent=2))
    print('done', flush=True)


if __name__ == '__main__':
    main(sys.argv[1:])
