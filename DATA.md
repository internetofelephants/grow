# Tree data: sources and reasoning

Values in the `SPECIES` table in `main.js`. Every tree is treated as **open-grown on a good site**
and every value is **typical, not a record**.

## How the numbers are used
- **Height** follows `H · (1 − e^(−k·age))^c`. `t50` (age at half height) and `c` (shape) are
  **fitted to published heights at known ages** (listed per tree below).
- **Crown width** follows the same kind of curve, 10% slower. **Trunk diameter** grows slowly all
  its life (fitted to data for giant sequoia; otherwise its half-way age is the shorter of
  4 × t50 or 30% of the lifespan).
- **Lifespan** is the **average** lifespan, not the maximum. Only redwood (500–700) and mountain ash
  (400) have a published average; for the rest it's the middle of the range sources give as the
  common or typical lifespan. Record ages are noted but not used.
- **Trunk** is diameter at breast height (d.b.h., 1.37 m / 4.5 ft above the ground), the standard
  forestry measure and what the sources give. Coconut palm is the trunk diameter (30–40 cm), which
  barely varies with height. The drawing uses it as the trunk width at the ground, with no root flare.
- **Death:** when a tree reaches its lifespan it's shown as dead (bare and pale) and stays that way.
  It doesn't decay or fall.

Confidence: **●** well sourced · **◐** partly sourced or interpreted · **○** estimate.

## The trees

| Tree | Height | Crown | Trunk | Lifespan | Fitted heights (source → model) |
|---|---|---|---|---|---|
| Coast redwood | 90 m ● | 18 m ◐ | 4 m ● | 600 ◐ | 10 y 4 → 4.1 · 50 y 38 → 35 · 100 y 59 → 64 |
| Giant sequoia | 76 m ● | 20 m ○ | 6 m ● | 2,500 ● | 50 y 30 → 26 · 400 y 34–73 → 70 · 1,000 y 74 → 76 |
| Bald cypress | 40 m ◐ | 12 m ○ | 2.0 m ◐ | 500 ◐ | 31 y 21.6 → 19.8 · 41 y 21 → 23.3 · 96 y 36.3 → 33.8 (rms 8.8%) |
| White pine | 46 m ● | 12 m ◐ | 1.0 m ● | 200 ● | 15 y 8 → 8 · 50 y 24 → 24 · 200 y 44 → 44 |
| Mountain ash | 85 m ● | 18 m ○ | 2.5 m ● | 400 ● | 8 y 15 → 15 · 22 y 33 → 36 |
| English oak | 31.5 m ● | 22 m ◐ | 2.0 m ◐ | 600 ● | Jüttner 1955 yield table, class II: 45 y 13.3 → 13.1 · 105 y 23.3 → 23.8 · 200 y 30.2 → 29.6 (rms 1.6%) |
| Sugar maple | 32 m ● | 14 m ◐ | 0.85 m ● | 350 ● | 40 y 12 → 12 · 150 y 31 → 31 |
| Paper birch | 21 m ● | 9 m ◐ | 0.35 m ● | 140 ● | 50 y 18 → 18 · 70 y ~20 → 20 |
| Lombardy poplar | 18 m ● | 4 m ● | 0.8 m ○ | 40 ● | 10 y 12 → 12 · 25 y 19 → 19 ◐ |
| Weeping willow | 12 m ● | 13 m ● | 0.9 m ○ | 30 ● | 5 y 6 → 6 · 15 y 11 → 11 ◐ |
| Coconut palm (tall) | 28 m ◐ | 10 m ● | 0.35 m ● | 80 ● | from trunk growth 0.4 m/yr after year 3.5: 10 y 4.6 → 4.5 · 30 y 12.6 → 12.8 · 80 y 24 → 23.4 ◐ |
| Apple (standard) | 8 m ● | 9 m ◐ | 0.4 m ○ | 100 ○ | 10 y 5 → 5 · 25 y 7.5 → 7.5 ◐ |
| Bristlecone pine | 10 m ● | 8 m ◐ | 1.5 m ◐ | 3,000 ◐ | **no growth data** ○ (t50 250, c 1.4) |

## Notes per tree

**Coast redwood.** Silvics: dominant young trees on good sites are 30.5–45.7 m at 50 years and
50.3–67.1 m at 100; trees over 61 m are common and many on river flats exceed 91 m; large trees are
3.7–4.9 m d.b.h.; oldest ~2,200 years, maturity at 400–500. Redwood park sources give an *average*
lifespan of 500–700 years (used: 600). Crown: an open-grown 30 m tree in New Zealand spreads 16.7 m.
*Changed:* height 95 → 90, lifespan 1,800 → 600.

**Giant sequoia.** Silvics: mature trees average ~76 m and 3–6 m d.b.h.; plantations grow
0.5–0.7 m a year; 34–73 m at 400 years, levelling near 76 m at 800–1,500; many living trees 2,000–3,000
years, oldest 3,200. Old-growth d.b.h. 0.48 m at 100, 1.32 at 400, 2.19 at 800 and 4.27 m at 2,000
(diameter curve fitted to these). Crown: 8–10 m on cultivated 30–50 m trees (Ebben nursery); 20 m for a
mature tree is an estimate (○). *Changed:* height 80 → 76,
lifespan 3,000 → 2,500, crown 24 → 20.

**Bald cypress.** (Replaced Douglas fir.) Silvics: plantation dominants 21.6 m at 31 years and 21 m at
41 (two different plantations, which is why the fit is only within ~9%); crop trees 36.3 m at 96; height
growth stops at about 200 years, after which many die back slowly from the top. In virgin forests the
largest trees were 43–46 m tall and 2.15–3.65 m d.b.h. (40 m and 2 m used for a typical old tree).
Trees 400–600 years old were reported as common in virgin stands, but Silvics warns that ring counts in
this species can overstate age (false rings; counts averaged 1.6 × the true age in one study), so 500 is
◐. Drawn with a swollen, buttressed base.

**White pine.** Silvics: commonly reaches 200 years, max over 450; 46 m and 1 m d.b.h. were common
in virgin forest; site index (height at 50) typically 18–37 m (24 m used); peak growth ~1 m/yr
around ages 10–15. *Changed:* height 45 → 46, lifespan 400 → 200, trunk 1.2 → 1.0.

**Mountain ash.** 15 m at 8 years and 33 m at 22 years in young stands; about 1 m a year on average;
typically 2.5 m d.b.h.; average lifespan 400, oldest ~500. Crown is described as small for the
tree's size, but not measured (estimate). *Changed:* trunk 3 → 2.5, crown 22 → 18.

**English oak.** Woodland Trust: grows to 20–40 m with a broad, spreading crown; "oak may live for
1,000 years, although 600 may be more typical on many sites". Girth typically up to 4 m (Wikipedia).
Height curve fitted to the Jüttner (1955) oak yield table, site class II, the class that heads for
~30 m, the middle of the 20–40 m range. Forest-grown oaks start slower than open-grown ones
(2.7 m at 10 years in the model). *Changed:* height 28 → 31.5, crown 26 → 22, lifespan 800 → 600.

**Sugar maple.** Silvics: ~0.3 m a year for the first 30–40 years; height growth stops around
140–150; mature trees 27–37 m tall, 76–91 cm d.b.h., 300–400 years old. Crown 9–15 m typical
(record 20 m). *Changed:* height 30 → 32, trunk 1.2 → 0.85, crown 18 → 14.

**Paper birch.** Silvics: mature stands average 21 m and 25–30 cm d.b.h.; site index 12–24 m at 50;
mature at 60–70 years and few live beyond 140–200. *Changed:* trunk 0.5 → 0.35, lifespan 120 → 140.

**Lombardy poplar.** "Up to 60 feet (18 m), spreading around 12 feet (4 m)"; most are killed by canker
within 15 years where it's common (Gardening Know How). Grows up to 6 ft (1.8 m) a year and typically
lives 30–50 years outside its natural habitat (Exeter Trees). *Changed:* height 30 → 18, lifespan
50 → 40, crown 5 → 4.

**Weeping willow.** UF/IFAS: 30–50 ft (9–15 m) tall and as wide, fast-growing, "usually still
short-lived to 30 years, or so". Reaches full height in 10–20 years. *Changed:* height 15 → 12,
lifespan 60 → 30, crown 16 → 13.

**Coconut palm (tall varieties).** FAO: trunk 30–40 cm across and 20–25 m or more tall; tall
varieties take 3–4 years to form a stem. Coconut Handbook: the stem then grows 30–50 cm a year,
slowing after about 40 years; economic life typically 60–80 years, up to 100. Fronds 4–6 m
(Wikipedia). Heights at age are worked out from those rates (◐). *Changed:* lifespan 90 → 80,
height curve slowed (was 0.5–1 m a year).

**Apple (standard tree on seedling rootstock).** About 7 m on seedling rootstock (PTES, UK);
30–40 ft (9–12 m) (UMD Extension). Standard trees "live for much longer than dwarfing or semi-standard
trees" (PTES), but I found **no reliable figure for a typical lifespan**: 100 is unverified (○).
The growth curve is inferred from full size in about 20–25 years (◐).

**Bristlecone pine.** 5–15 m tall (to 16); trunk up to 2–3.6 m; average ages ~1,000 years on south
slopes and ~2,000 on north slopes, many over 4,000, oldest ~4,850. Dead wood persists for thousands
of years. I found **no height-at-age data**; growth is "extremely slow". The lifespan (3,000) is a
judgement between those figures. *Changed:* height 12 → 10, lifespan 4,000 → 3,000.

## More trees from other countries (second row)

Chosen because each has **published height-by-age data** plus a typical height and lifespan (teak, added later, has no sourced lifespan; see below).
The seven European trees use the classic German **yield tables**, which give the stand's mean
height every 5 years for each site class (I–V). For each tree I used the site class whose heights
lead to the typical mature height given in the EU's *European Atlas of Forest Tree Species*.
Yield tables stop at 80–150 years, so the final height (H) is fitted along with the curve
and is consistent with the atlas range. Yield-table trees grow in stands, so they're a little taller and
slimmer than open-grown trees.

| Tree | Height | Crown | Trunk | Lifespan | Height data and fit |
|---|---|---|---|---|---|
| Norway spruce | 40 m ● | 9 m ○ | 1.0 m ◐ | 250 ● | Wiedemann 1936/42, class I: 50 y 21.2 → 20.7 · 120 y 35.9 → 35.8 (rms 1.3%) |
| European beech | 41 m ● | 18 m ○ | 1.2 m ◐ | 225 ● | Wiedemann 1931, class I.5: 60 y 20.3 → 20.2 · 140 y 35.6 → 35.3 (rms 0.4%) |
| Scots pine | 28 m ● | 10 m ○ | 0.8 m ○ | 250 ● | Wiedemann 1943, class II.5: 55 y 15.5 → 15.4 · 140 y 25.2 → 25.3 (rms 0.5%) |
| European larch | 36 m ● | 10 m ○ | 1.0 m ○ | 600 ◐ | Schober 1946, class I.5: 50 y 22.4 → 22.5 · 140 y 34.8 → 34.6 (rms 0.8%) |
| Silver birch | 26 m ● | 8 m ○ | 0.4 m ○ | 95 ● | Schwappach 1903/29, class II: 45 y 15.3 → 15.3 · 80 y 20.9 → 21.0 (rms 0.2%) |
| Black alder | 25 m ● | 8 m ○ | 0.5 m ○ | 60 ● | Mitscherlich 1945, class III: 35 y 12.7 → 12.5 · 90 y 20.3 → 20.0 (rms 0.9%) |
| European ash | 32 m ● | 15 m ○ | 1.0 m ○ | 200 ● | Wimmenauer 1919/29, class I: 50 y 22.5 → 22.5 · 120 y 31.4 → 31.0 (rms 1.0%) |
| Kauri (NZ) | 45 m ● | 20 m ○ | 2.5 m ◐ | 800 ◐ | planted kauri, average site: 20 y 8.8 → 9.0 · 50 y 20.4 · 60 y 22.3 · 100 y 28.1 → 30.2 (rms 4.9%) |
| Teak (South & Southeast Asia) | 40 m ◐ | 12 m ○ | 1.0 m ○ | 200 ○ | Caribbean site class I (Weaver 1993, fig. 3, read from the chart): 10 y 20 → 17.9 · 20 y 26 → 26.5 · 30 y 28.5 → 31.6 (rms 8.8%) |
| Paraná pine (Brazil) | 30 m ● | 15 m ○ | 1.0 m ● | 200 ● | 30 y 20.8 → 20.8 (good plantation site); fastest growth ~0.9 m/yr, at 15–20 y (model: 13 y) ◐ |

**Norway spruce.** Atlas: up to 50–60 m, trunk up to 150 cm, normally reaches 200–300 years.
**European beech.** Atlas: commonly 30–40 m, up to 50; typical life span 150–300 years. Trunk typically up to 1.5 m.
**Scots pine.** Atlas: 23–27 m on average, over 40 m possible; oldest over 750 in Lapland. Woodland
Trust: "may live for 500 years, although 250 may be more typical on many sites".
**European larch.** Atlas: reaches 45 m, rarely over 50; lifespan 600–800 years in optimal conditions,
over 1,000 at high elevation. No source gives an average, so 600 is the low end of the optimal range (◐).
**Silver birch.** Atlas: 15–25 m, exceptionally 30; commonly lives 90–100 years, rarely 150.
**Black alder.** Atlas: normally 10–25 m (exceptionally 35–40); normally lives about 60 years (to 160).
**European ash.** Atlas: can reach 45 m; Woodland Trust: up to 35 m, "200 may be more typical" for
lifespan (Forestry and Land Scotland: 200). Ash dieback now kills many trees much younger.
**Kauri.** Steward, Kimberley, Mason & Dungey (2014), planted kauri across New Zealand: average site index 20.4 m
(at 50 y), 22.3 m at 60, 28.1 m predicted at 100; height growth flattens toward 45 m; slow for the first
~10 years. Normally lives longer than 600 years and many exceed 1,000 (800 used, ◐). Trunk 1–4 m+.
**Teak.** (Replaced silver fir.) Weaver (1993, USDA International Institute of Tropical Forestry):
reaches 45 m in its native range with a buttressed trunk at maturity; the Caribbean site chart gives top
heights of nearly 30 m at 30 years on the best sites, and height growth slows faster there than in
teak's native range. 40 m is used as the final height, between the Caribbean curves (~30 m) and the
45 m native maximum (◐). FAO (Pandey & Brown): a tall clean bole of more than 25 m; natural teak forests
are managed on ~120-year rotations. **No source gives a typical lifespan** (only harvest rotations and
record trees of several centuries): 200 is unverified (○).
**Paraná pine.** Typically 25–35 m, trunk 50–120 cm (Gymnosperm Database); 60–115 ft (18–35 m) after
50–90 years, and "fully mature trees may be 140 to 250 years of age" (Knox, UF/IFAS, 2014); growth is S-shaped,
fastest at 15–20 years, levelling after ~30 in plantations. In 30-year-old plantations a good site
has dominant trees over 18.1 m (average site 13.1–18.0 m) (*Forests*, 2024); 20.8 m is used.

**Crown widths and most trunk diameters** for these ten are estimates (○). Yield tables give
stand diameters, not open-grown ones, and I didn't find reliable crown spreads.

**Considered but left out** for lack of verifiable data: Japanese cedar/sugi (good growth data, but no typical lifespan), Japanese larch (no lifespan),
deodar cedar (no growth curve), baobab (no height-by-age data).

## Sources
The full list, with citations and what each source supports, is in [REFERENCES.md](REFERENCES.md).
