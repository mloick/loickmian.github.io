"""Wrap each page fragment in src/ into a full HTML file for GitHub Pages."""
from pathlib import Path

root = Path(__file__).parent
PAGES = {"page.html": "index.html", "expedition.html": "expedition.html"}

for src, dst in PAGES.items():
    head, body = (root / "src" / src).read_text().split("<!--/head-->", 1)
    out = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{head.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
"""
    (root / dst).write_text(out)
    print(dst, "written,", len(out), "bytes")
