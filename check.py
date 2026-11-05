#!/usr/bin/env python3
"""Fails if any page points at a file that isn't there, which on GitHub Pages means exact case, or if what search engines read has drifted from the pages."""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
REF = re.compile(r'(?:src|href|poster)="([^"#?]+)')


def exists_exact(path):
    parts = os.path.relpath(path, ROOT).split(os.sep)
    here = ROOT
    for part in parts:
        if part not in os.listdir(here):
            return False
        here = os.path.join(here, part)
    return True


bad = []
pages = [f for f in os.listdir(ROOT) if f.endswith(".html")]
assert "index.html" in pages, "GitHub Pages needs index.html at the root"
for page in pages:
    text = open(os.path.join(ROOT, page), encoding="utf-8").read()
    for ref in REF.findall(text):
        if re.match(r"[a-z]+:|//", ref):
            continue
        assert not ref.startswith("/"), f"{page}: {ref} is root-relative and breaks on a project site"
        if not exists_exact(os.path.join(ROOT, ref)):
            bad.append(f"{page}: {ref}")
    url = "https://sournote.games/" + ("" if page == "index.html" else page)
    if f'<link rel="canonical" href="{url}">' not in text:
        bad.append(f"{page}: no canonical link to {url}")
    if 'name="description"' not in text:
        bad.append(f"{page}: no description")
    if f"<loc>{url}</loc>" not in open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read():
        bad.append(f"sitemap.xml: {url} is missing")
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        try:
            json.loads(block)
        except ValueError as e:  # search engines would just ignore it, with no error anywhere
            bad.append(f"{page}: broken structured data: {e}")
print("\n".join(bad) or f"ok: {len(pages)} pages, every local reference exists")
sys.exit(1 if bad else 0)
