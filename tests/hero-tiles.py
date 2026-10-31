"""Verify every published tile and its highest-resolution original bytes."""
from pathlib import Path
from PIL import Image
import hashlib,json,math,tempfile

root=Path('images/panoramas/tiles')
cache=Path(tempfile.gettempdir())/'yousee360-hero-source-tiles'
sources=json.loads((root/'sources.json').read_text())
count=0;originals=0;masters=0
for key,source in sources.items():
    extension=source['extension']
    assert extension in ('webp','jpg'),key
    if 'sourceFile' in source:
        # Cut from a local equirectangular master (_build_showcase_tiles.py): the master must still exist unchanged.
        master=Path(source['sourceFile'])
        assert master.is_file(),f'{key}: missing master {master}'
        assert hashlib.sha256(master.read_bytes()).hexdigest()==source['sourceSha256'],f'{key}: master changed {master}'
        assert source['cubeResolution']==source['sourceSize'][0]//4,key
        masters+=1
    for level in range(1,source['maxLevel']+1):
        width=source['cubeResolution']//2**(source['maxLevel']-level)
        for face in 'fbrlud':
            for y in range(math.ceil(width/512)):
                for x in range(math.ceil(width/512)):
                    path=root/key/str(level)/f'{face}{y}_{x}.{extension}'
                    with Image.open(path) as image:
                        assert image.size==(min(512,width-x*512),min(512,width-y*512)),str(path)
                        image.verify()
                    count+=1
                    if level==source['maxLevel'] and 'sourceFile' not in source:
                        if 'sourceArchive' in source:
                            original=Path(source['sourceArchive'])/source['sourceTile'].format(face=source['sourceFaceOrder'].index(face),row=y,column=x)
                        else:
                            original=cache/key/face/f'{y}_{x}.webp'
                        assert path.read_bytes()==original.read_bytes(),str(path)
                        originals+=1
report=dict(scenes=len(sources),verifiedTiles=count,byteIdenticalOriginalTiles=originals,scenesFromVerifiedLocalMasters=masters)
Path('reports/hero-tile-verification.json').write_text(json.dumps(report,indent=2))
print(report)
