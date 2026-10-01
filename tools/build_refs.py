#!/usr/bin/env python3
"""Copy REFERENCES.md into the References tab of index.html.

REFERENCES.md is the source of truth. After editing it, run:
    python3 tools/build_refs.py
It handles the small subset of Markdown that file uses: ## headings, paragraphs,
"- " list items (with indented continuation lines), **bold**, *italic* and [links](url).
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = 'https://github.com/internetofelephants/grow/blob/main/'
START = re.compile(r'(<!-- refs:start[^>]*-->\n)(.*?)(<!-- refs:end -->)', re.S)


def inline(text):
    text = html.escape(text, quote=False)

    def link(m):
        label, url = m.group(1), m.group(2)
        if not re.match(r'https?://', url):          # repo-relative files (e.g. DATA.md) point at GitHub
            url = REPO + url
        return f'<a href="{html.escape(url)}" target="_blank" rel="noopener">{label}</a>'

    text = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', text)
    return text


def convert(md):
    out, para, items = [], [], []

    def flush():
        if para:
            out.append(f'<p>{inline(" ".join(para))}</p>')
            para.clear()
        if items:
            out.append('<ul>' + ''.join(f'<li>{inline(i)}</li>' for i in items) + '</ul>')
            items.clear()

    for line in md.splitlines():
        if line.startswith('# '):                      # the file's own title; the tab already says it
            continue
        if not line.strip():
            flush()
        elif line.startswith('## '):
            flush()
            out.append(f'<h3>{inline(line[3:].strip())}</h3>')
        elif line.startswith('- '):
            if para:
                flush()
            items.append(line[2:].strip())
        elif line.startswith('  ') and items:          # continuation of the last list item
            items[-1] += ' ' + line.strip()
        else:
            if items:
                flush()
            para.append(line.strip())
    flush()
    return '\n'.join(out) + '\n'


def main():
    page = ROOT / 'index.html'
    body = convert((ROOT / 'REFERENCES.md').read_text())
    text = page.read_text()
    new, n = START.subn(lambda m: m.group(1) + body + m.group(3), text)
    if n != 1:
        raise SystemExit('refs markers not found in index.html')
    page.write_text(new)
    print(f'References tab updated ({body.count("<li>")} list items).')


if __name__ == '__main__':
    main()
