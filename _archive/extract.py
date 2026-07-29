import re

with open(r'd:\Projects\Tejavardhan\AI_MetroFlow\frontend\dist\assets\index-CdbAX7PD.css', 'r', encoding='utf-8') as f:
    css = f.read()

# The CSS is minified, so it's likely all on one line or a few lines.
# We want to extract custom classes like .gradient-mesh-bg, .blob, .blob-1, .table-row-colorful
# These are usually at the end of the file after the Tailwind utilities, OR we can regex search for them.

matches = re.finditer(r'(\.[a-zA-Z0-9_-]+)(?:[:a-zA-Z0-9_-]+)?\{([^}]+)\}', css)

custom_classes = [
    'gradient-mesh-bg', 'blob', 'blob-1', 'blob-2', 'blob-3', 'blob-4',
    'table-row-colorful', 'gradient-text', 'badge-gradient-emerald', 'badge-gradient-red', 'btn-shimmer'
]

extracted = []
for match in matches:
    selector = match.group(1)
    if any(c in selector for c in custom_classes):
        # wait, we want the full selector, e.g. `.table-row-colorful:hover`
        full_match = match.group(0)
        extracted.append(full_match)

# Also extract keyframes
keyframes = re.finditer(r'@keyframes\s+[a-zA-Z0-9_-]+\{.*?\}', css)
for kf in keyframes:
    extracted.append(kf.group(0))

with open(r'd:\Projects\Tejavardhan\AI_MetroFlow\_archive\extracted_custom.css', 'w', encoding='utf-8') as f:
    f.write('\n'.join(extracted))

print(f"Extracted {len(extracted)} rules.")
