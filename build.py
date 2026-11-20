"""Wrap src/atlas.html into a full index.html for GitHub Pages."""
from pathlib import Path
src = Path(__file__).with_name("src") / "atlas.html"
head, body = src.read_text().split("<!--/head-->", 1)
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
Path(__file__).with_name("index.html").write_text(out)
print("index.html written,", len(out), "bytes")
