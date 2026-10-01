# Grow

Grow ("A tree growth simulator"), a browser visualization: 1–5 trees grow side by side from seed, drawn as pencil sketches on a pencil
grid, at 1 second = 1 year (1×, 5×, 20×). You see how fast each grows, how tall each gets relative to the
others at the same fixed scale, and which outlive which. Repo: https://github.com/internetofelephants/grow
(the folder is `~/code/tree-growth`; the user owns the repo).

## Working with the user
- **Data integrity comes first.** The user will only publish if the numbers are accurate and verified.
  Only add or change tree data from sources you have actually read (not search-result summaries).
  Record every value, its source and its confidence (● sourced, ◐ partly, ○ estimate) in `DATA.md`, and
  every source in `REFERENCES.md`. Say plainly when something can't be verified; the user decides
  whether to accept an unverified value (e.g. teak's lifespan).
- Lifespan means the **average/typical** lifespan, not the maximum or record age.
- "Trunk" (`D`) is diameter at breast height (d.b.h., 1.37 m).
- Ask before committing; the user says "commit and push" when ready. Commit to `main` and push.
- Check in before big additions; make recommendations rather than surveys.

## Look and feel (rules)
- Everything is pencil on paper: graphite strokes (`INK` #2e2d33) on a paper texture (`PAPER` #f3efe5),
  handwritten Caveat font (Google Fonts). No colour.
- Every pencil stroke takes a seed so its wobble is identical every frame (no boiling).
- HTML controls match: Caveat, hand-drawn borders (the irregular `border-radius`), hatched fill for "on".
- The scale is **always fixed** during a run (to the tallest selected tree's mature height, also fitted to
  widths). It is set when the run starts (play or scrub), not while trees are being picked: before the first
  run it fits every species, and after Reset it stays at the last run's scale until play.
  Don't reveal a tree's full size before it reaches it (no "full size" marks; tooltips show only the
  Latin name). A label gains "full size" at 97% of final height.

## Files
- `index.html`: page, styles, controls, and the information panel markup. Loads `main.js?v=<timestamp>`
  via `document.write` because the dev server lets the browser cache stale code.
- `main.js`: everything else (no build step).
- `DATA.md`: every tree's numbers, how they were fitted, sources and confidence.
- `REFERENCES.md`: the reference list. **Source of truth for the References tab**: after editing it run
  `python3 tools/build_refs.py`, which rewrites the block between `<!-- refs:start -->` and
  `<!-- refs:end -->` in `index.html` (DATA.md links point to GitHub).
- `trees.csv`: the spreadsheet of every value the simulation uses, with confidence; linked at the top of
  the References tab. **Generated**: after changing `SPECIES` or DATA.md's tree tables run
  `node tools/build_csv.js` (it also warns if DATA.md and main.js disagree).
- `.claude/launch.json`: dev server `trees-dev` (`python3 -m http.server 8340`, `autoPort`).

## main.js layout (top to bottom)
utils → **species** (`SPECIES` table, `FACTS` hover text) → **growth** (`curve`, `stateAt`) → **skeletons** (`genBroad`,
`genConifer`, `ENV` crown envelopes) → canvas + paper texture → **pencil strokes** (`pline`, `limb`,
`scribble`, `tuft`, `weep`, `pcircle`) → **trees** (`drawBroad`, `drawConifer`, `drawPalm`, `drawTree`)
→ **the sheet** (grid, axis, ground, 1.75 m person for scale, `labelLines`/`labelRoom`/`drawLabel`) →
**state** (`selected`, `buildTrees`, `maxYear`, `targetView`, `render`) → **controls** (picker, play,
reset, speeds, scrub, "Let trees die", picker lock) → **information panel** → **hover facts** (`updateTip`,
hit areas in `hits` from `render`) → `frame`.

## Systems
**Species.** 23 trees. First row (no `group`): coast redwood, giant sequoia, bald cypress, white pine,
mountain ash, English oak, sugar maple, paper birch, Lombardy poplar, weeping willow, coconut palm, apple,
bristlecone pine. Second row (`group: 'more'`, "from other countries"): Norway spruce, European beech,
Scots pine, teak, European larch, silver birch, black alder, European ash, kauri, Paraná pine.
Fields: `H` mature height, `CW` crown width, `D` d.b.h., `life` typical lifespan, `t50`/`c` height curve,
optional `dt50`/`dc` diameter curve, `form` (`broad`, `conifer`, `palm`), `bark`, and drawing params `P`.
`sp.seed` comes from the array index, so **reordering or inserting species changes other trees' shapes**:
replace in place or append.

**Growth.** Height = `H · curve(age, t50, c)` (Chapman-Richards: `(1 − e^(−k·age))^c`, `k` from `t50`).
`t50` and `c` are **fitted to published heights at known ages** (see DATA.md; fits were done with small
node scripts minimising relative error). Crown width uses the same curve 10% slower (palms: full width
by ~year 6). Trunk: `dt50/dc` if given, else half-way at min(4·t50, 0.3·life); palms don't thicken.
Last 15% of life: foliage thins (decline). European trees' curves come from German yield tables
(ForestElementsR package); the yield-table site class chosen is the one heading for the EU atlas's
typical mature height.

**Death.** "Let trees die" checkbox (default on): at `life` the tree is bare and pale, stays standing
(no decay or falling: no snag data). Off: trees keep growing in full leaf past their lifespan, labelled
"† would have died at N". A run ends 20 years after the longest-lived selected tree dies.

**Run flow.** Pick 1–5 trees. Once a run starts (`playing || year > 0`), the picker is locked
(`pickerLocked`, `syncPickerLock`) so a newly picked tree can't appear fully grown and give things away.
Reset clears to 0 years, keeps the selection, unlocks the picker. Play at the end restarts. The year shows
as "N years". Space toggles play.

**Labels.** Under each tree: name, Latin name, height, then status ("full size", "† died at N",
"reached N m", "† would have died at N"). No age per tree. Lines shrink, then wrap, to fit the column;
the space below the ground (`labelRoom`) is sized for the tallest possible label so the ground never moves.

**Drawing.** Broadleaves: a main axis with laterals shaped by an envelope, recursive sub-branches, leaf
clusters at tips (`cloud` scribbles, `tuft` needle bursts, `weep` hanging strands); x is spread outward
(`spreadOut`, default 0.8) so foliage fills the crown. Options: `sparse` (skip some clusters), `ink`
(lighter foliage), `tuftN`, `fruit` (apple), `flare` (buttressed base: bald cypress, teak). Conifers:
whorls of branches with needle ticks; old trees shed lower branches (`lift`) and branch length is scaled
over the living crown (`reach`) so they keep full width. Palm: curved ringed trunk, arching fronds,
coconuts.

**Hover facts.** Pointing at a tree (its column, from the tree's current top down through its label) or
tapping it shows a pencil-style card with its name and a 2–3 sentence fact from `FACTS`. Facts never
mention height or lifespan or hint at which tree ends up biggest or oldest; each is sourced in DATA.md
("Tidbits"). The card is rechecked every frame, since trees grow under a still pointer.

**Information panel.** ? button (top right) or the `?` key opens "Information & guide" with three tabs:
Instructions (simple how-to, written in `index.html`; it must never hint at which tree grows
tallest or lives longest), About (the authors' note, written in `index.html`), References (generated). Esc, ?, ✕ or a click outside
closes it.

## Running and testing
- Start the preview with `preview_start` name `trees-dev`, or open `index.html` in a browser
  (the pane shows `file://` pages as static snapshots without scripts, so use the server there).
- Useful page globals: `selected`, `refreshPicker()`, `buildTrees()`, `year`, `view.h = 0` (re-snap scale),
  `render(dt)`, `stateAt(sp, year)`, `skeleton(sp)`, `letDie`.
- **Screenshots:** don't stub `requestAnimationFrame`; the canvas then often doesn't reach the screen
  and screenshots come out blank. Set `selected`/`year` and let the loop draw, wait ~1 s, then screenshot.
  The first script run right after a page load sometimes doesn't stick; repeat it.
- A headless check: run `main.js` in node with a stubbed DOM/canvas to catch errors or slow frames.

## Open items
- Unverified values: apple lifespan (100), teak lifespan (200), bristlecone growth curve (no
  height-by-age data), most crown widths and many trunk diameters (○ in DATA.md). Beech looks slender
  because its 18 m crown width is an estimate.
- Considered and left out for lack of data: Japanese cedar/sugi (no typical lifespan), Japanese larch,
  deodar, baobab, cedar of Lebanon (no typical lifespan), cork oak (thin growth data).
- The yield-table curves are for trees grown in forest stands (a little taller and slimmer than
  open-grown trees, which the original 13 represent).
