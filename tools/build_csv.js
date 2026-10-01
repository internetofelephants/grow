#!/usr/bin/env node
// Write trees.csv: the numbers the simulation uses (SPECIES in main.js) with the confidence of each
// value (the tree tables in DATA.md). Run after changing either:
//     node tools/build_csv.js
// It warns if a value in DATA.md's tables doesn't match main.js.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf8');
const md = fs.readFileSync(path.join(ROOT, 'DATA.md'), 'utf8');

const start = js.indexOf('const SPECIES = [');
const end = js.indexOf('];', start);
const SPECIES = eval(js.slice(start + 'const SPECIES = '.length, end + 1));

// rows of the two tree tables: | Tree | Height | Crown | Trunk | Lifespan | ...
const CONF = { '●': 'sourced', '◐': 'partly sourced', '○': 'estimate' };
const rows = {};
for (const line of md.split('\n')) {
  const c = line.split('|').map(s => s.trim());
  if (c.length < 7 || !/[●◐○]/.test(c[2])) continue;
  const name = c[1].replace(/\s*\(.*\)$/, '');                 // "Apple (standard)" → "Apple"
  const cell = s => ({ value: parseFloat(s.replace(/,/g, '')), conf: CONF[(s.match(/[●◐○]/) || [])[0]] || '' });
  rows[name] = { H: cell(c[2]), CW: cell(c[3]), D: cell(c[4]), life: cell(c[5]), fit: c[6].replace(/\*\*/g, '') };
}

const esc = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const header = [
  'Tree', 'Latin name', 'Row',
  'Mature height (m)', 'Height confidence', 'Crown width (m)', 'Crown confidence',
  'Trunk d.b.h. (m)', 'Trunk confidence', 'Typical lifespan (years)', 'Lifespan confidence',
  'Age at half height (t50, years)', 'Height curve shape (c)',
  'Trunk: age at half diameter (years)', 'Trunk curve shape',
  'Heights used for the fit (age: source → model, m)',
];
const out = [header.map(esc).join(',')];
let warnings = 0;
for (const sp of SPECIES) {
  const r = rows[sp.name];
  if (!r) { console.warn(`! ${sp.name}: no row in DATA.md`); warnings++; continue; }
  for (const k of ['H', 'CW', 'D', 'life']) {
    if (Math.abs(r[k].value - sp[k]) > 1e-9) { console.warn(`! ${sp.name} ${k}: main.js ${sp[k]}, DATA.md ${r[k].value}`); warnings++; }
  }
  out.push([
    sp.name, sp.sci, sp.group === 'more' ? 'second (other countries)' : 'first',
    sp.H, r.H.conf, sp.CW, r.CW.conf, sp.D, r.D.conf, sp.life, r.life.conf,
    sp.t50, sp.c, sp.dt50 ?? 'default', sp.dc ?? 'default', r.fit,
  ].map(esc).join(','));
}
fs.writeFileSync(path.join(ROOT, 'trees.csv'), out.join('\n') + '\n');
console.log(`trees.csv: ${out.length - 1} trees${warnings ? `, ${warnings} warning(s)` : ''}`);
