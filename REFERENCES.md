# References

Sources used to set and verify the tree data (heights, growth with age, trunk diameter, crown width
and lifespan). Each was read directly. "Used for" says which trees and values it supports; the
reasoning behind each number is in [DATA.md](DATA.md).

**The data:** every number the simulation uses, with how confident we are in each, is in the
spreadsheet [trees.csv](trees.csv) (opens in Excel, Numbers or Google Sheets).

## Forestry references

**USDA Forest Service. *Silvics of North America*.** Burns, R. M. & Honkala, B. H. (technical
coordinators), 1990. Agriculture Handbook 654. Washington, DC: U.S. Department of Agriculture,
Forest Service. Chapters:
- Olson, D. F., Jr., Roy, D. F. & Walters, G. A. *Sequoia sempervirens* (Redwood). Vol. 1.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/sequoia/sempervirens.htm)
  · Used for: coast redwood height by age, mature height, trunk diameter, maximum age.
- Weatherspoon, C. P. *Sequoiadendron giganteum* (Giant Sequoia). Vol. 1.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/sequoiadendron/giganteum.htm)
  · Used for: giant sequoia height and diameter by age, mature height, lifespan.
- Wilhite, L. P. & Toliver, J. R. *Taxodium distichum* (Baldcypress). Vol. 1.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/taxodium/distichum.htm)
  · Used for: bald cypress height by age, mature size, age.
- Wendel, G. W. & Smith, H. C. *Pinus strobus* (Eastern White Pine). Vol. 1.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/pinus/strobus.htm)
  · Used for: white pine height growth, site index, mature size, lifespan.
- Godman, R. M., Yawney, H. W. & Tubbs, C. H. *Acer saccharum* (Sugar Maple). Vol. 2.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/acer/saccharum.htm)
  · Used for: sugar maple height growth, mature size, lifespan.
- Safford, L. O., Bjorkbom, J. C. & Zasada, J. C. *Betula papyrifera* (Paper Birch). Vol. 2.
  [Link](https://web.archive.org/web/2020/https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/betula/papyrifera.htm)
  · Used for: paper birch site index, mature size, lifespan.

**European yield tables**, as published in the R package *ForestElementsR*: Biber, P., Toraño Caicoya, A.,
Hilmers, T., et al. *ForestElementsR: Data Structures and Functions for Working with Forest Data*,
version 3.0.0 (2026). Technical University of Munich. Yield tables from the Bavarian State Forest
Administration's collection.
[CRAN](https://cran.r-project.org/package=ForestElementsR)
· Used for height by age (one site class per tree, see DATA.md):
- Wiedemann (1936/42), Norway spruce, moderate thinning: Norway spruce
- Wiedemann (1931), European beech, moderate thinning: European beech
- Wiedemann (1943), Scots pine, moderate thinning: Scots pine
- Schober (1946), European larch, moderate thinning: European larch
- Schwappach (1903/29), birch: silver birch
- Mitscherlich (1945), black alder, heavy thinning: black alder
- Wimmenauer (1919/29), ash, weak thinning: European ash
- Jüttner (1955), oak, moderate thinning: English oak

**San-Miguel-Ayanz, J., de Rigo, D., Caudullo, G., Houston Durrant, T. & Mauri, A. (eds.), 2016.
*European Atlas of Forest Tree Species*.** Luxembourg: Publications Office of the European Union.
Chapters used:
- *Picea abies in Europe: distribution, habitat, usage and threats* (Caudullo, G., Tinner, W. & de Rigo, D.)
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Picea_abies.pdf) · Norway spruce height, trunk, lifespan
- *Fagus sylvatica in Europe: distribution, habitat, usage and threats*
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Fagus_sylvatica.pdf) · European beech height, lifespan
- *Pinus sylvestris in Europe: distribution, habitat, usage and threats* (Houston Durrant, T., de Rigo, D. & Caudullo, G.)
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Pinus_sylvestris.pdf) · Scots pine average height
- *Larix decidua and other larches in Europe: distribution, habitat, usage and threats*
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Larix_decidua.pdf) · European larch height, lifespan
- *Alnus glutinosa in Europe: distribution, habitat, usage and threats*
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Alnus_glutinosa.pdf) · black alder height, lifespan
- *Fraxinus excelsior in Europe: distribution, habitat, usage and threats*
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Fraxinus_excelsior.pdf) · European ash maximum height
- European Commission, Joint Research Centre. *Silver birch* (atlas tree page).
  [Link](https://forest.jrc.ec.europa.eu/en/european-atlas/qr-trees/silver-birch) · silver birch height, lifespan

## Research papers

- Steward, G. A., Kimberley, M. O., Mason, E. G. & Dungey, H. S., 2014. Growth and productivity of
  New Zealand kauri (*Agathis australis* (D.Don) Lindl.) in planted forests. *New Zealand Journal of
  Forestry Science* 44: 27.
  [Link](https://nzjforestryscience.springeropen.com/articles/10.1186/s40490-014-0027-2)
  · Used for: kauri height by age.
- Souza, T., Dobner, M., Batista, D. S., Araujo, D. J., Nascimento, G. S. & da Silva, L. J. R., 2024.
  Site quality for *Araucaria angustifolia* plantations with subtropical Cambisol is driven by soil
  organism assemblage and the litter and soil compartments. *Forests* 15(3): 510.
  [Link](https://doi.org/10.3390/f15030510) · Used for: Paraná pine height at 30 years by site quality.

## Extension and horticultural publications

- Weaver, P. L., 1993. *Tectona grandis L. f. Teak*. SO-ITF-SM-64. Río Piedras, PR: USDA Forest Service,
  International Institute of Tropical Forestry.
  [PDF](https://research.fs.usda.gov/download/treesearch/30352.pdf)
  · Used for: teak height by age (Caribbean site classes), mature height in its native range.
- Pandey, D. & Brown, C., 2000. Teak: a global overview. *Unasylva* 201. FAO.
  [Link](https://www.fao.org/4/x4565e/x4565e03.htm) · Used for: teak bole height, rotation ages.
- Gilman, E. F., Hilbert, D., Watson, D. G., Klein, R., Koeser, A. & McLean, D. C., 2018.
  *Salix babylonica: Weeping Willow*. ENH-734/ST576. University of Florida IFAS Extension.
  [Link](https://ask.ifas.ufl.edu/publication/st576) · Used for: weeping willow height, spread, lifespan.
- Knox, G. W., 2014. *Paraná Pine, Araucaria angustifolia: An Ancient-Looking Conifer for Modern
  Landscapes*. ENH1248. University of Florida IFAS Extension.
  [PDF](https://journals.flvc.org/edis/article/download/132001/135588/238089) · Used for: Paraná pine mature size and age.
- University of Maryland Extension, 2022. *All About Apple Rootstocks*. FS-2022-0638.
  [Link](https://extension.umd.edu/resource/all-about-apple-rootstocks) · Used for: standard apple tree height.
- People's Trust for Endangered Species. *Rootstock* (Traditional Orchard Project practical guides).
  [Link](https://ptes.org/campaigns/traditional-orchard-project/orchard-practical-guides/planting-fruit-trees/rootstock/)
  · Used for: standard apple tree height and relative longevity.
- FAO. Coconut: botany and growth (chapter of FAO document W7731E).
  [Link](https://www.fao.org/4/W7731E/w7731e07.htm) · Used for: coconut palm trunk diameter, height, age when the stem forms.
- Tetra Pak. *Coconut Handbook*, chapter "Plantation".
  [Link](https://coconuthandbook.tetrapak.com/chapter/plantation) · Used for: coconut palm stem growth per year, lifespan.

## Conservation and forestry organisations

- Woodland Trust. *English oak (Quercus robur)*.
  [Link](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/english-oak/)
  · Used for: English oak height and crown.
- Woodland Trust, Ancient Tree Inventory. Species guides:
  [oak](https://ati.woodlandtrust.org.uk/how-to-record/species-guides/oak/) ·
  [Scots pine](https://ati.woodlandtrust.org.uk/how-to-record/species-guides/scots-pine/) ·
  [ash](https://ati.woodlandtrust.org.uk/how-to-record/species-guides/ash/)
  · Used for: typical lifespans of English oak, Scots pine and European ash.
- Woodland Trust. *Ash (Fraxinus excelsior)*.
  [Link](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/ash/)
  · Used for: European ash height.
- Forestry and Land Scotland. *Ash*. [Link](https://forestryandland.gov.scot/learn/trees/ash)
  · Used for: European ash height and lifespan.
- PBS *Nature*. *Survivors of the Firestorm: Mountain Ash fact sheet*.
  [Link](https://www.pbs.org/wnet/nature/survivors-of-the-firestorm-mountain-ash-fact-sheet/6513)
  · Used for: mountain ash height, growth rate, average lifespan.
- Visit Redwoods (Humboldt County). *Redwood facts*.
  [Link](https://www.visitredwoods.com/listing/redwood-facts/186/) · Used for: coast redwood average lifespan.
- New Zealand Tree Register. Tree 1561 (*Sequoia sempervirens*).
  [Link](https://www.treeregister.nz/tree/view/1561) · Used for: coast redwood crown spread.

## Botanical databases and reference works

- Earle, C. J. (ed.). *The Gymnosperm Database*:
  [*Pinus longaeva*](https://conifers.org/pi/Pinus_longaeva.php) ·
  [*Araucaria angustifolia*](https://www.conifers.org/ar/Araucaria_angustifolia.php)
  · Used for: bristlecone pine height, trunk and age; Paraná pine height and trunk.
- Ebben Nurseries. *Sequoiadendron giganteum*.
  [Link](https://www.ebben.nl/en/treeebb/segigant-sequoiadendron-giganteum/) · Used for: giant sequoia crown width in cultivation.
- Gardening Know How. *Lombardy poplar trees*.
  [Link](https://www.gardeningknowhow.com/ornamental/trees/poplar/lombardy-poplar-trees.htm)
  · Used for: Lombardy poplar height, spread, canker.
- Exeter Trees. *Lombardy poplar*. [Link](https://exetertrees.uk/poplar-lombardy.html)
  · Used for: Lombardy poplar growth rate and lifespan.
- Wikipedia (and the sources it cites):
  [*Eucalyptus regnans*](https://en.wikipedia.org/wiki/Eucalyptus_regnans) (mountain ash height by age, trunk, age) ·
  [*Quercus robur*](https://en.wikipedia.org/wiki/Quercus_robur) (English oak trunk girth) ·
  [*Cocos nucifera*](https://en.wikipedia.org/wiki/Cocos_nucifera) (coconut palm fronds, lifespan) ·
  [*Pinus longaeva*](https://en.wikipedia.org/wiki/Pinus_longaeva) (bristlecone pine height and average ages) ·
  [*Agathis australis*](https://en.wikipedia.org/wiki/Agathis_australis) (kauri height and lifespan) ·
  [*Araucaria angustifolia*](https://en.wikipedia.org/wiki/Araucaria_angustifolia) (Paraná pine height, early growth)

## Sources for the tree facts (hover text)

These support the short facts shown when hovering over a tree; which claim each supports is in
[DATA.md](DATA.md) ("Tidbits").

- National Park Service. *About the Trees* (Redwood National and State Parks).
  [Link](https://www.nps.gov/redw/learn/nature/about-the-trees.htm) · coast redwood fog, bark, sprouting
- Harvey, H. T. *Giant Sequoia Ecology*, chapter 5. National Park Service Scientific Monograph 12.
  [Link](https://npshistory.com/series/science/12/chap5.htm) · giant sequoia cones and fire
- California State Parks. *Fire and the Giant Sequoia*.
  [Link](https://learning.parks.ca.gov/topics/nature/fire-and-the-giant-sequoia/) · giant sequoia cones, range
- Beckett, H. *Bald Cypress (Taxodium distichum)*. Gulf Coast Bird Observatory.
  [PDF](https://www.gcbo.org/wp-content/uploads/2025/09/Bald-Cypress.pdf) · bald cypress name, knees, "Wood Eternal"
- Secrest Arboretum, Ohio State University. *Swamp Thing: Baldcypress*.
  [Link](https://secrest.osu.edu/newsletter/all-things-secrest-0/winter-2025/secrest-select-plant/swamp-thing-baldcypress)
  · bald cypress knees
- Dawson, T. E., 1993. Hydraulic lift and water use by plants: implications for water balance,
  performance and plant-plant interactions. *Oecologia* 95: 565–574.
  [Link](https://agris.fao.org/search/ar/records/647758eef2e6fe92b365cd60) · sugar maple hydraulic lift
- Woodland Trust. *English oak*, *Common beech* and *Jay*.
  [oak](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/english-oak/) ·
  [beech](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/common-beech/) ·
  [jay](https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/animals/birds/jay/)
  · species on oak, acorns, jays; beech shade and winter leaves
- PBS *Nature*. *Survivors of the Firestorm: Mountain Ash fact sheet*.
  [Link](https://www.pbs.org/wnet/nature/survivors-of-the-firestorm-mountain-ash-fact-sheet/6513) · mountain ash bark
- Broschat, T. K. *Palm Morphology and Anatomy*. ENH1212/EP473. University of Florida IFAS Extension.
  [Link](https://ask.ifas.ufl.edu/publication/EP473) · palm trunk and bud
- Bartlett, M., 2017. *Want To Grow An Apple Tree? Don't Start With Apple Seeds*. Northwest Public Broadcasting.
  [Link](https://www.nwpb.org/2017/05/03/want-to-grow-an-apple-tree-dont-start-with-apple-seeds/)
  · apples not true-to-type, grafting
- National Park Service. *Bristlecone Pine* (Bryce Canyon National Park).
  [Link](https://www.nps.gov/brca/learn/nature/bristleconepine.htm) · bristlecone needles
- City of Oslo. *The Trafalgar Square Christmas tree*.
  [Link](https://www.oslo.kommune.no/english/politics/the-city-council/the-mayor/the-trafalgar-square-christmas-tree/)
  · Norway spruce gift to London
- *European Atlas of Forest Tree Species* (see above): *Picea abies*, *Pinus sylvestris*, *Larix decidua*,
  *Alnus glutinosa*, *Fraxinus excelsior*, and *Betula pendula and Betula pubescens*
  [PDF](https://forest.jrc.ec.europa.eu/media/atlas/Betula_spp.pdf)
  · spruce, Scots pine, larch, alder, ash and silver birch facts
- Trees for Life. *Concerted action needed to ensure future of Scotland's national tree*.
  [Link](https://treesforlife.org.uk/concerted-action-needed-ensure-future-scotlands-national-tree/) · Scots pine
- Mustila Arboretum. *Betula pendula: European white birch, silver birch*.
  [Link](https://mustila.fi/en/?p=15364) · Finland's national tree
- Harper, D. *book*. Online Etymology Dictionary. [Link](https://www.etymonline.com/word/book) · "book" and beech
- Wikipedia (and the sources it cites):
  [*Sequoiadendron giganteum*](https://en.wikipedia.org/wiki/Sequoiadendron_giganteum) ·
  [*Pinus strobus*](https://en.wikipedia.org/wiki/Pinus_strobus) ·
  [Pine Tree Riot](https://en.wikipedia.org/wiki/Pine_Tree_Riot) ·
  [*Eucalyptus regnans*](https://en.wikipedia.org/wiki/Eucalyptus_regnans) ·
  [*Acer saccharum*](https://en.wikipedia.org/wiki/Acer_saccharum) ·
  [*Betula papyrifera*](https://en.wikipedia.org/wiki/Betula_papyrifera) ·
  [Lombardy poplar](https://en.wikipedia.org/wiki/Lombardy_poplar) ·
  [*Salix babylonica*](https://en.wikipedia.org/wiki/Salix_babylonica) ·
  [Salicin](https://en.wikipedia.org/wiki/Salicin) ·
  [Coconut](https://en.wikipedia.org/wiki/Coconut) ·
  [*Malus sieversii*](https://en.wikipedia.org/wiki/Malus_sieversii) ·
  [*Pinus longaeva*](https://en.wikipedia.org/wiki/Pinus_longaeva) ·
  [Teak](https://en.wikipedia.org/wiki/Teak) ·
  [Yggdrasil](https://en.wikipedia.org/wiki/Yggdrasil) ·
  [*Agathis australis*](https://en.wikipedia.org/wiki/Agathis_australis) ·
  [*Araucaria angustifolia*](https://en.wikipedia.org/wiki/Araucaria_angustifolia)
