# -*- coding: utf-8 -*-
"""Build "view in your room" AR portal models from the tour panoramas.

Why this exists
---------------
iOS Safari has no WebXR, so the in-page WebGL portal cannot pin itself to a
real floor on an iPhone. Apple's AR Quick Look can -- it runs ARKit, ships with
every iPhone, and costs nothing. It takes a USDZ. Android's Scene Viewer does
the same job from a GLB. Google's <model-viewer> hands off to whichever the
device has.

So each tour gets two files built from one piece of geometry:

  * an arch standing on the floor, which is what the visitor walks toward
  * an inverted sphere behind it, textured with that tour's panorama

The sphere is single-sided and wound to face inward, so its near wall is culled
and you look straight past it into the far wall. From across the room that reads
as a globe of somewhere else standing on your floor; walk through the arch and
the scene closes around you.

It is deliberately not a hard-edged portal. That needs stencil masking to hide
the interior everywhere except the doorway, and neither AR Quick Look nor Scene
Viewer exposes a stencil buffer or a depth-only occluder. The in-page WebGL
portal does mask properly, so the two experiences differ by design rather than
by oversight.

Usage:  python _build_ar_portals.py
"""
import io
import json
import math
import os
import struct
import zipfile

import numpy as np
from PIL import Image

OUT_DIR = os.path.join('AR Version', 'models')
TEX_MAX = 2048            # panorama width baked into the model
DOME_RADIUS = 3.5         # metres; the sphere's near face sits on the threshold
ARCH_HALF_WIDTH = 0.62    # a doorway you can believe you walk through
ARCH_STRAIGHT = 1.35      # height of the vertical posts before the curve
FRAME_THICK = 0.075       # square cross-section of the arch frame
SEG_U, SEG_V = 72, 36     # sphere tessellation

BRAND_GREEN = (0.60, 0.86, 0.24)

TOURS = [
    ('casadelrio', 'Casa del Rio',          'images/tours/casadelrio_360.jpg'),
    ('junglo',     'Junglo Resort & Spa',   'images/tours/junglo_360.jpg'),
    ('elgenio',    'El Genio',              'images/tours/elgenio_360.jpg'),
    ('arboeden',   'Arboeden Eco Retreat',  'images/tours/arboeden_360.jpg'),
    ('arenal',     'Arenal Volcano',        'images/hero-360-arenal-4k.jpg'),
    # Lower-resolution masters. Softer than the rest, but a shareable file for
    # every tour beats a gap in the portfolio.
    ('dragonfly',  'Dragonfly Awakening',   'images/tours/dragonfly_360.jpg'),
    ('kenko',      'Kenko Street View',     'images/tours/kenko_360.jpg'),
]


# ----------------------------------------------------------------- geometry --
def build_dome():
    """Inverted UV sphere: normals inward, winding flipped, equirectangular UVs.

    The seam column is duplicated so u can run cleanly from 0 to 1 without the
    last quad interpolating backwards across the whole texture.
    """
    pts, uvs, nrm = [], [], []
    for j in range(SEG_V + 1):
        v = j / SEG_V
        phi = v * math.pi                      # 0 at the top
        sp, cp = math.sin(phi), math.cos(phi)
        for i in range(SEG_U + 1):
            u = i / SEG_U
            theta = u * 2.0 * math.pi
            # u = 0.5 must land on -Z, the way the visitor walks in, so the
            # stitch seam ends up behind them rather than dead ahead.
            x = -sp * math.sin(theta)
            y = cp
            z = sp * math.cos(theta)
            pts.append((x * DOME_RADIUS, y * DOME_RADIUS, z * DOME_RADIUS))
            nrm.append((-x, -y, -z))           # inward
            # v is flipped: image row 0 is the top of the sky
            uvs.append((u, v))

    idx = []
    row = SEG_U + 1
    for j in range(SEG_V):
        for i in range(SEG_U):
            a = j * row + i
            b = a + row
            # Wound counter-clockwise as seen from inside the sphere. Culling
            # follows winding, not the normals array, so getting this backwards
            # produces an ordinary ball: visible outside, invisible inside.
            idx += [a, b, a + 1]
            idx += [a + 1, b, b + 1]

    pts = np.array(pts, dtype=np.float32)
    # lift and push back so the sphere's near surface lands on the doorway
    pts[:, 1] += 1.6
    pts[:, 2] -= DOME_RADIUS
    return pts, np.array(uvs, np.float32), np.array(nrm, np.float32), np.array(idx, np.uint32)


def arch_path(steps=48):
    """Outline of the doorway: two posts, then a semicircular head."""
    pts, tangents = [], []
    half = ARCH_HALF_WIDTH
    for side in (-1, 1):
        for k in range(6):
            t = k / 5.0
            pts.append((side * half, t * ARCH_STRAIGHT))
            tangents.append((0.0, 1.0))
    # rebuild as one continuous path: up the left post, over, down the right
    path = [(-half, t / 5.0 * ARCH_STRAIGHT) for t in range(6)]
    for k in range(steps + 1):
        a = math.pi - (k / steps) * math.pi
        path.append((half * math.cos(a), ARCH_STRAIGHT + half * math.sin(a)))
    path += [(half, ARCH_STRAIGHT - t / 5.0 * ARCH_STRAIGHT) for t in range(1, 6)]
    return path


def build_arch():
    """Sweep a square cross-section along the doorway outline."""
    path = arch_path()
    n = len(path)
    h = FRAME_THICK / 2.0
    pts, nrm, uvs, idx = [], [], [], []

    for i, (x, y) in enumerate(path):
        # in-plane normal: perpendicular to the local path direction
        px, py = path[max(0, i - 1)]
        nx_, ny_ = path[min(n - 1, i + 1)]
        dx, dy = nx_ - px, ny_ - py
        ln = math.hypot(dx, dy) or 1.0
        ox, oy = -dy / ln, dx / ln              # outward in the XY plane

        # square ring: outward/inward x front/back in z
        ring = [
            (x + ox * h, y + oy * h, -h), (x + ox * h, y + oy * h, h),
            (x - ox * h, y - oy * h, h), (x - ox * h, y - oy * h, -h),
        ]
        ring_n = [(ox, oy, 0), (0, 0, 1), (-ox, -oy, 0), (0, 0, -1)]
        for k in range(4):
            pts.append(ring[k])
            nrm.append(ring_n[k])
            uvs.append((i / (n - 1), k / 3.0))

    for i in range(n - 1):
        a, b = i * 4, (i + 1) * 4
        for k in range(4):
            k2 = (k + 1) % 4
            idx += [a + k, b + k, a + k2]
            idx += [a + k2, b + k, b + k2]

    return (np.array(pts, np.float32), np.array(uvs, np.float32),
            np.array(nrm, np.float32), np.array(idx, np.uint32))


# --------------------------------------------------------------------- GLB --
def write_glb(path, meshes, tex_bytes):
    """meshes: list of (name, pts, uvs, nrm, idx, material_index)."""
    buf = bytearray()
    views, accessors, prims = [], [], []

    def add_view(data, target=None):
        while len(buf) % 4:
            buf.append(0)
        off = len(buf)
        buf.extend(data)
        v = {'buffer': 0, 'byteOffset': off, 'byteLength': len(data)}
        if target:
            v['target'] = target
        views.append(v)
        return len(views) - 1

    for name, pts, uvs, nrm, idx, mat in meshes:
        p_v = add_view(pts.astype('<f4').tobytes(), 34962)
        accessors.append({'bufferView': p_v, 'componentType': 5126, 'count': len(pts),
                          'type': 'VEC3',
                          'min': [float(pts[:, i].min()) for i in range(3)],
                          'max': [float(pts[:, i].max()) for i in range(3)]})
        a_pos = len(accessors) - 1

        n_v = add_view(nrm.astype('<f4').tobytes(), 34962)
        accessors.append({'bufferView': n_v, 'componentType': 5126, 'count': len(nrm),
                          'type': 'VEC3'})
        a_nrm = len(accessors) - 1

        t_v = add_view(uvs.astype('<f4').tobytes(), 34962)
        accessors.append({'bufferView': t_v, 'componentType': 5126, 'count': len(uvs),
                          'type': 'VEC2'})
        a_uv = len(accessors) - 1

        i_v = add_view(idx.astype('<u4').tobytes(), 34963)
        accessors.append({'bufferView': i_v, 'componentType': 5125, 'count': len(idx),
                          'type': 'SCALAR'})
        a_idx = len(accessors) - 1

        prims.append({'attributes': {'POSITION': a_pos, 'NORMAL': a_nrm,
                                     'TEXCOORD_0': a_uv},
                      'indices': a_idx, 'material': mat})

    img_view = add_view(tex_bytes)

    gltf = {
        'asset': {'version': '2.0', 'generator': 'YouSee360 portal builder'},
        'extensionsUsed': ['KHR_materials_unlit'],
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'mesh': 0, 'name': 'Portal'}],
        'meshes': [{'name': 'Portal', 'primitives': prims}],
        'buffers': [{'byteLength': 0}],
        'bufferViews': views,
        'accessors': accessors,
        'images': [{'bufferView': img_view, 'mimeType': 'image/jpeg'}],
        'samplers': [{'magFilter': 9729, 'minFilter': 9987,
                      'wrapS': 10497, 'wrapT': 33071}],
        'textures': [{'source': 0, 'sampler': 0}],
        'materials': [
            {   # the panorama: unlit so AR lighting cannot dim the scene
                'name': 'Dome',
                'pbrMetallicRoughness': {'baseColorTexture': {'index': 0},
                                         'metallicFactor': 0.0, 'roughnessFactor': 1.0},
                'extensions': {'KHR_materials_unlit': {}},
                'doubleSided': False,
            },
            {   # the arch: glows enough to read against a dark room
                'name': 'Arch',
                'pbrMetallicRoughness': {
                    'baseColorFactor': [BRAND_GREEN[0], BRAND_GREEN[1], BRAND_GREEN[2], 1.0],
                    'metallicFactor': 0.0, 'roughnessFactor': 0.45},
                'emissiveFactor': [BRAND_GREEN[0] * 0.5, BRAND_GREEN[1] * 0.5,
                                   BRAND_GREEN[2] * 0.5],
                'doubleSided': True,
            },
        ],
    }
    while len(buf) % 4:
        buf.append(0)
    gltf['buffers'][0]['byteLength'] = len(buf)

    js = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    js += b' ' * ((4 - len(js) % 4) % 4)
    bin_ = bytes(buf)

    total = 12 + 8 + len(js) + 8 + len(bin_)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack('<II', len(bin_), 0x004E4942)); f.write(bin_)
    return total


# -------------------------------------------------------------------- USDZ --
def usda_mesh(name, pts, uvs, nrm, idx, material, double_sided):
    counts = ' '.join(['3'] * (len(idx) // 3))
    return """
    def Mesh "%(name)s"
    {
        uniform bool doubleSided = %(ds)s
        int[] faceVertexCounts = [%(counts)s]
        int[] faceVertexIndices = [%(idx)s]
        point3f[] points = [%(pts)s]
        normal3f[] normals = [%(nrm)s] (
            interpolation = "vertex"
        )
        texCoord2f[] primvars:st = [%(uvs)s] (
            interpolation = "vertex"
        )
        rel material:binding = </Portal/Looks/%(material)s>
        uniform token subdivisionScheme = "none"
    }
""" % dict(name=name, ds='true' if double_sided else 'false', counts=counts,
           idx=', '.join(str(int(i)) for i in idx),
           pts=', '.join('(%.5f, %.5f, %.5f)' % tuple(p) for p in pts),
           nrm=', '.join('(%.5f, %.5f, %.5f)' % tuple(n) for n in nrm),
           uvs=', '.join('(%.5f, %.5f)' % tuple(t) for t in uvs),
           material=material)


def build_usda(dome, arch, tex_name, title):
    d_pts, d_uv, d_nrm, d_idx = dome
    a_pts, a_uv, a_nrm, a_idx = arch
    g = BRAND_GREEN
    return """#usda 1.0
(
    defaultPrim = "Portal"
    metersPerUnit = 1
    upAxis = "Y"
    doc = "YouSee360 -- %(title)s AR portal"
)

def Xform "Portal" (
    assetInfo = {
        string name = "%(title)s"
    }
    kind = "component"
)
{
%(dome)s
%(arch)s

    def Scope "Looks"
    {
        def Material "DomeMat"
        {
            token outputs:surface.connect = </Portal/Looks/DomeMat/Surface.outputs:surface>

            def Shader "Surface"
            {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor = (0, 0, 0)
                color3f inputs:emissiveColor.connect = </Portal/Looks/DomeMat/Tex.outputs:rgb>
                float inputs:metallic = 0
                float inputs:roughness = 1
                float inputs:opacity = 1
                token outputs:surface
            }

            def Shader "Tex"
            {
                uniform token info:id = "UsdUVTexture"
                asset inputs:file = @%(tex)s@
                float2 inputs:st.connect = </Portal/Looks/DomeMat/uvReader.outputs:result>
                token inputs:wrapS = "repeat"
                token inputs:wrapT = "clamp"
                float3 outputs:rgb
            }

            def Shader "uvReader"
            {
                uniform token info:id = "UsdPrimvarReader_float2"
                token inputs:varname = "st"
                float2 inputs:fallback = (0, 0)
                float2 outputs:result
            }
        }

        def Material "ArchMat"
        {
            token outputs:surface.connect = </Portal/Looks/ArchMat/Surface.outputs:surface>

            def Shader "Surface"
            {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor = (%(gr).3f, %(gg).3f, %(gb).3f)
                color3f inputs:emissiveColor = (%(er).3f, %(eg).3f, %(eb).3f)
                float inputs:metallic = 0
                float inputs:roughness = 0.45
                token outputs:surface
            }
        }
    }
}
""" % dict(title=title, tex=tex_name,
           dome=usda_mesh('Dome', d_pts, d_uv, d_nrm, d_idx, 'DomeMat', False),
           arch=usda_mesh('Arch', a_pts, a_uv, a_nrm, a_idx, 'ArchMat', True),
           gr=g[0], gg=g[1], gb=g[2],
           er=g[0] * 0.5, eg=g[1] * 0.5, eb=g[2] * 0.5)


def write_usdz(path, usda_bytes, tex_name, tex_bytes):
    """USDZ is an uncompressed zip whose every file starts 64-byte aligned.

    Padding goes in each local header's extra field, which is the trick the
    format relies on so a reader can mmap the payloads directly.
    """
    entries = [('portal.usda', usda_bytes), (tex_name, tex_bytes)]
    out = bytearray()
    central = bytearray()

    for name, data in entries:
        nb = name.encode('utf-8')
        offset = len(out)
        pad = (64 - ((offset + 30 + len(nb)) % 64)) % 64
        if 0 < pad < 4:
            pad += 64
        extra = b'\x00' * pad
        crc = zipfile.crc32(data) & 0xFFFFFFFF

        out += struct.pack('<IHHHHHIIIHH', 0x04034B50, 20, 0, 0, 0, 0,
                           crc, len(data), len(data), len(nb), len(extra))
        out += nb + extra
        assert len(out) % 64 == 0, 'payload for %s is not 64-byte aligned' % name
        out += data

        central += struct.pack('<IHHHHHHIIIHHHHHII', 0x02014B50, 20, 20, 0, 0, 0, 0,
                               crc, len(data), len(data), len(nb), len(extra),
                               0, 0, 0, 0, offset)
        central += nb + extra

    cd_off = len(out)
    out += central
    out += struct.pack('<IHHHHIIH', 0x06054B50, 0, 0, len(entries), len(entries),
                       len(central), cd_off, 0)
    with open(path, 'wb') as f:
        f.write(bytes(out))
    return len(out)


# --------------------------------------------------------------------- main --
def main():
    if not os.path.isdir('images'):
        raise SystemExit('run this from the site root')
    os.makedirs(OUT_DIR, exist_ok=True)

    dome = build_dome()
    arch = build_arch()
    print('geometry: dome %d verts / %d tris, arch %d verts / %d tris'
          % (len(dome[0]), len(dome[3]) // 3, len(arch[0]), len(arch[3]) // 3))

    for key, title, src in TOURS:
        if not os.path.exists(src):
            print('  SKIP %-12s (no %s)' % (key, src))
            continue

        im = Image.open(src).convert('RGB')
        if im.width > TEX_MAX:
            im = im.resize((TEX_MAX, TEX_MAX // 2), Image.LANCZOS)
        jpg = io.BytesIO()
        im.save(jpg, 'JPEG', quality=86, optimize=True)
        tex = jpg.getvalue()

        meshes = [('Dome', dome[0], dome[1], dome[2], dome[3], 0),
                  ('Arch', arch[0], arch[1], arch[2], arch[3], 1)]
        glb = os.path.join(OUT_DIR, '%s-portal.glb' % key)
        usdz = os.path.join(OUT_DIR, '%s-portal.usdz' % key)

        g = write_glb(glb, meshes, tex)
        usda = build_usda(dome, arch, 'textures/%s.jpg' % key, title).encode('utf-8')
        u = write_usdz(usdz, usda, 'textures/%s.jpg' % key, tex)

        print('  %-12s glb %6.2f MB   usdz %6.2f MB   texture %dx%d'
              % (key, g / 1e6, u / 1e6, im.width, im.height))


if __name__ == '__main__':
    main()
