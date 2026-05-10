import glob, re

files = glob.glob(r'f:\Project\Anime-Script-Pro\frontend\src\pages\studio\AnimeStudio\**\*.tsx', recursive=True)
pattern = re.compile(r'`/projects/\$\{projectId\}/([^`]+)`')

for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
        content = fh.read()
    new_content = pattern.sub(lambda m: '`/studio/' + m.group(1) + '`', content)
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        print(f'Fixed: {f}')

print('Done.')
