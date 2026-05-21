import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
frontend = root / 'frontend'

targets = ['AppFooter', 'EcoPointIcon', 'BrandLogo']

# Replace any import that references a /brand/<Target> path
def replace_brand_imports(text):
    changed = False
    lines = text.splitlines()
    out = []
    for line in lines:
        replaced = line
        for t in targets:
            if re.search(r"['\"]/brand/" + re.escape(t) + r"['\"]", line) or re.search(r"['\"]/components/brand/" + re.escape(t) + r"['\"]", line):
                # replace whole import line with named import from @ecoo/ui
                replaced = re.sub(r"^\s*import\s+[^;]+;?\s*$", f"import {{ {t} }} from '@ecoo/ui';", line)
                changed = True
                break
        out.append(replaced)
    return "\n".join(out), changed

files = []
for p in frontend.rglob('*'):
    if any(part == 'node_modules' or part == 'public' for part in p.parts):
        continue
    if p.suffix.lower() in ('.js', '.jsx', '.ts', '.tsx'):
        files.append(p)
changed = []
for f in files:
    try:
        text = f.read_text(encoding='utf-8')
    except Exception:
        continue
    new_text, file_changed = replace_brand_imports(text)
    if new_text != text:
        f.write_text(new_text, encoding='utf-8')
        changed.append(str(f.relative_to(root)))

print('updated', '\n'.join(changed))
