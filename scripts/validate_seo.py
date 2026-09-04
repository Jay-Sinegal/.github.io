#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "docs"
sitemap = (root / "sitemap.xml").read_text()
required = {
    "title": r"<title>[^<]+</title>",
    "description": r'<meta name="description" content="[^"]+"',
    "robots": r'<meta name="robots" content="[^"]+"',
    "canonical": r'<link rel="canonical" href="https://jaylensinegal\.com/[^"]*"',
    "Open Graph title": r'<meta property="og:title" content="[^"]+"',
    "Open Graph description": r'<meta property="og:description" content="[^"]+"',
    "Open Graph URL": r'<meta property="og:url" content="[^"]+"',
    "Open Graph image": r'<meta property="og:image" content="[^"]+"',
    "Twitter card": r'<meta name="twitter:card" content="summary_large_image"',
    "GA4": r"G-V09SKB92BX",
    "JSON-LD": r"application/ld\+json",
}

failed = False
for path in sorted(root.rglob("*.html")):
    html = path.read_text()
    name = path.relative_to(root)
    for label, pattern in required.items():
        if not re.search(pattern, html, re.I):
            print(f"{name}: missing {label}", file=sys.stderr)
            failed = True
    blocks = re.findall(r'<script\s+type="application/ld\+json">(.*?)</script>', html, re.I | re.S)
    for block in blocks:
        try:
            json.loads(block)
        except json.JSONDecodeError as error:
            print(f"{name}: invalid JSON-LD: {error}", file=sys.stderr)
            failed = True
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', html, re.I)
    if canonical and f"<loc>{canonical.group(1)}</loc>" not in sitemap:
        print(f"{name}: canonical missing from sitemap", file=sys.stderr)
        failed = True

if failed:
    sys.exit(1)
print("SEO validation passed.")
