'use strict';

// ---------- utils
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hash(n) {
  n |= 0;
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
const fmtM = m => (m < 10 ? m.toFixed(1) : Math.round(m)) + ' m';

const PAPER = '#f3efe5';
const INK = '#2e2d33';

// ---------- species
// H: mature height (m), CW: crown width (m), D: trunk diameter in old age (m), life: typical lifespan (years),
// t50: age at half its mature height, c: curve shape (low = fast start and a long slow finish),
// dt50/dc: the same for trunk diameter where there's data.
// Typical values, not records. t50 and c are fitted to published heights at known ages.
// Sources and the reasoning for each number are in DATA.md.
const SPECIES = [
  { id: 'redwood', name: 'Coast redwood', sci: 'Sequoia sempervirens', H: 90, CW: 18, D: 4, life: 600, t50: 64, c: 1.65,
    form: 'conifer', bark: 'furrow', P: { whorls: 34, cone: 0.85, droop: 0.12, lift: 0.55, needle: 1.6, tick: 1 } },
  { id: 'sequoia', name: 'Giant sequoia', sci: 'Sequoiadendron giganteum', H: 76, CW: 20, D: 6, life: 2500, t50: 92, c: 0.8, dt50: 1260, dc: 0.8,
    form: 'conifer', bark: 'furrow', P: { whorls: 28, cone: 0.55, droop: 0.05, lift: 0.5, needle: 2.2, tick: 1 } },
  { id: 'baldcypress', name: 'Bald cypress', sci: 'Taxodium distichum', H: 40, CW: 12, D: 2, life: 500, t50: 31.5, c: 0.8,
    form: 'broad', bark: 'furrow', P: { trunk: 0.45, nodes: 7, env: 'dome', angLow: 1.35, angHigh: 1.0, depth: 3, spread: 0.7, ratio: 0.7, up: 0.05, jit: 0.7, leafR: 0.11, asp: 0.5, leaf: 'tuft', tuftN: 20, wob: 0.03, flare: 1.8 } },
  { id: 'pine', name: 'White pine', sci: 'Pinus strobus', H: 46, CW: 12, D: 1, life: 200, t50: 47, c: 1.2,
    form: 'conifer', bark: 'furrow', P: { whorls: 16, cone: 0.5, droop: -0.1, lift: 0.35, needle: 1.3, tick: -1, ragged: 0.6 } },
  { id: 'ash', name: 'Mountain ash', sci: 'Eucalyptus regnans', H: 85, CW: 18, D: 2.5, life: 400, t50: 28, c: 1.05,
    form: 'broad', bark: 'smooth', P: { trunk: 0.58, nodes: 7, env: 'round', angLow: 1.2, angHigh: 0.7, depth: 3, spread: 0.75, ratio: 0.68, up: 0.1, jit: 0.5, leafR: 0.13, asp: 0.6, leaf: 'cloud', sparse: 0.25} },
  { id: 'oak', name: 'English oak', sci: 'Quercus robur', H: 31.5, CW: 22, D: 2, life: 600, t50: 56, c: 1.25,
    form: 'broad', bark: 'furrow', P: { trunk: 0.3, nodes: 6, env: 'dome', angLow: 1.25, angHigh: 0.5, depth: 3, spread: 0.8, ratio: 0.7, up: 0.1, jit: 0.6, leafR: 0.12, asp: 0.85, leaf: 'cloud' } },
  { id: 'maple', name: 'Sugar maple', sci: 'Acer saccharum', H: 32, CW: 14, D: 0.85, life: 350, t50: 50, c: 2.7,
    form: 'broad', bark: 'hatch', P: { trunk: 0.28, nodes: 7, env: 'round', angLow: 1.0, angHigh: 0.35, depth: 3, spread: 0.6, ratio: 0.7, up: 0.2, jit: 0.4, leafR: 0.13, asp: 0.9, leaf: 'cloud' } },
  { id: 'birch', name: 'Paper birch', sci: 'Betula papyrifera', H: 21, CW: 9, D: 0.35, life: 140, t50: 21, c: 1.4,
    form: 'broad', bark: 'birch', P: { trunk: 0.22, nodes: 9, env: 'ovoid', angLow: 1.0, angHigh: 0.45, depth: 2, spread: 0.5, ratio: 0.7, up: 0.25, jit: 0.4, leafR: 0.14, asp: 1.0, leaf: 'cloud' } },
  { id: 'poplar', name: 'Lombardy poplar', sci: "Populus nigra 'Italica'", H: 18, CW: 4, D: 0.8, life: 40, t50: 8, c: 1.65,
    form: 'broad', bark: 'furrow', P: { trunk: 0.06, nodes: 12, env: 'column', angLow: 0.3, angHigh: 0.12, depth: 2, spread: 0.2, ratio: 0.75, up: 0.5, jit: 0.15, leafR: 0.22, asp: 1.5, leaf: 'cloud', sparse: 0.8, ink: 0.55 } },
  { id: 'willow', name: 'Weeping willow', sci: 'Salix babylonica', H: 12, CW: 13, D: 0.9, life: 30, t50: 5, c: 1.4,
    form: 'broad', bark: 'furrow', P: { trunk: 0.35, nodes: 6, env: 'round', angLow: 1.3, angHigh: 0.6, depth: 3, spread: 0.7, ratio: 0.7, up: 0.1, jit: 0.5, leafR: 0.1, asp: 0.8, leaf: 'weep', weep: 0.55 } },
  { id: 'palm', name: 'Coconut palm', sci: 'Cocos nucifera', H: 28, CW: 10, D: 0.35, life: 80, t50: 33.5, c: 1.2,
    form: 'palm', bark: 'rings', P: { lean: 0.12 } },
  { id: 'apple', name: 'Apple', sci: 'Malus domestica', H: 8, CW: 9, D: 0.4, life: 100, t50: 7.5, c: 1.4,
    form: 'broad', bark: 'hatch', P: { trunk: 0.3, nodes: 5, env: 'round', angLow: 1.2, angHigh: 0.75, depth: 3, spread: 0.8, ratio: 0.7, up: 0.1, jit: 0.9, leafR: 0.14, asp: 0.85, leaf: 'cloud', fruit: true, sparse: 0.35, ink: 0.7 } },
  { id: 'bristlecone', name: 'Bristlecone pine', sci: 'Pinus longaeva', H: 10, CW: 8, D: 1.5, life: 3000, t50: 250, c: 1.4,
    form: 'broad', bark: 'furrow', P: { trunk: 0.22, nodes: 5, env: 'round', angLow: 1.3, angHigh: 0.7, depth: 3, spread: 0.9, ratio: 0.7, up: 0.05, jit: 1.1, leafR: 0.12, asp: 0.8, leaf: 'tuft', wob: 0.08 } },
  // More trees from other countries (second row of the picker; group: 'more'). Sources in DATA.md.
  { id: 'spruce', group: 'more', name: 'Norway spruce', sci: 'Picea abies', H: 40, CW: 9, D: 1, life: 250, t50: 48, c: 1.8,
    form: 'conifer', bark: 'furrow', P: { whorls: 30, cone: 1.0, droop: 0.3, lift: 0.3, needle: 1.2, tick: 1 } },
  { id: 'beech', group: 'more', name: 'European beech', sci: 'Fagus sylvatica', H: 41, CW: 18, D: 1.2, life: 225, t50: 61, c: 1.6,
    form: 'broad', bark: 'smooth', P: { trunk: 0.22, nodes: 7, env: 'dome', angLow: 1.35, angHigh: 0.75, depth: 3, spread: 0.75, ratio: 0.7, up: 0.06, jit: 0.4, leafR: 0.12, asp: 0.85, leaf: 'cloud' } },
  { id: 'scotspine', group: 'more', name: 'Scots pine', sci: 'Pinus sylvestris', H: 28, CW: 10, D: 0.8, life: 250, t50: 49, c: 1.3,
    form: 'broad', bark: 'furrow', P: { trunk: 0.6, nodes: 5, env: 'round', angLow: 1.2, angHigh: 0.8, depth: 3, spread: 0.8, ratio: 0.7, up: 0.05, jit: 0.9, leafR: 0.13, asp: 0.6, leaf: 'tuft', wob: 0.04 } },
  { id: 'teak', group: 'more', name: 'Teak', sci: 'Tectona grandis', H: 40, CW: 12, D: 1, life: 200, t50: 12, c: 0.8,
    form: 'broad', bark: 'furrow', P: { trunk: 0.45, nodes: 6, env: 'dome', angLow: 1.35, angHigh: 0.85, depth: 3, spread: 0.8, ratio: 0.7, up: 0.05, jit: 0.5, leafR: 0.15, asp: 0.8, leaf: 'cloud', ink: 0.85, flare: 1.3 } },
  { id: 'larch', group: 'more', name: 'European larch', sci: 'Larix decidua', H: 36, CW: 10, D: 1, life: 600, t50: 37.5, c: 1.3,
    form: 'conifer', bark: 'furrow', P: { whorls: 18, cone: 0.8, droop: 0.15, lift: 0.45, needle: 0.8, tick: -1, ragged: 0.4 } },
  { id: 'silverbirch', group: 'more', name: 'Silver birch', sci: 'Betula pendula', H: 26, CW: 8, D: 0.4, life: 95, t50: 35.5, c: 1.15,
    form: 'broad', bark: 'birch', P: { trunk: 0.2, nodes: 9, env: 'ovoid', angLow: 1.15, angHigh: 0.65, depth: 2, spread: 0.6, ratio: 0.7, up: 0.12, jit: 0.4, leafR: 0.13, asp: 1.0, leaf: 'weep', weep: 0.1} },
  { id: 'alder', group: 'more', name: 'Black alder', sci: 'Alnus glutinosa', H: 25, CW: 8, D: 0.5, life: 60, t50: 35.5, c: 0.8,
    form: 'broad', bark: 'furrow', P: { trunk: 0.15, nodes: 9, env: 'ovoid', angLow: 1.1, angHigh: 0.5, depth: 2, spread: 0.5, ratio: 0.7, up: 0.15, jit: 0.4, leafR: 0.13, asp: 0.9, leaf: 'cloud' } },
  { id: 'euash', group: 'more', name: 'European ash', sci: 'Fraxinus excelsior', H: 32, CW: 15, D: 1, life: 200, t50: 32.5, c: 1.7,
    form: 'broad', bark: 'furrow', P: { trunk: 0.35, nodes: 7, env: 'round', angLow: 1.25, angHigh: 0.7, depth: 3, spread: 0.7, ratio: 0.68, up: 0.1, jit: 0.4, leafR: 0.12, asp: 0.8, leaf: 'cloud', sparse: 0.3 } },
  { id: 'kauri', group: 'more', name: 'Kauri', sci: 'Agathis australis', H: 45, CW: 20, D: 2.5, life: 800, t50: 62.5, c: 1,
    form: 'broad', bark: 'smooth', P: { trunk: 0.62, nodes: 6, env: 'dome', angLow: 1.4, angHigh: 0.95, depth: 3, spread: 0.8, ratio: 0.7, up: 0.04, jit: 0.6, leafR: 0.12, asp: 0.5, leaf: 'cloud' } },
  { id: 'parana', group: 'more', name: 'Paraná pine', sci: 'Araucaria angustifolia', H: 30, CW: 15, D: 1, life: 200, t50: 21.5, c: 2.5,
    form: 'broad', bark: 'furrow', P: { trunk: 0.65, nodes: 6, env: 'cup', angLow: 1.35, angHigh: 1.0, depth: 2, spread: 0.5, ratio: 0.75, up: 0.35, jit: 0.3, leafR: 0.16, asp: 0.35, leaf: 'tuft', tuftN: 26 } },
];
SPECIES.forEach((sp, i) => { sp.seed = 977 * (i + 1) + 13; });

// A short fact shown when hovering over a tree. Never about height or lifespan.
// Each is checked against the sources listed in DATA.md ("Tidbits").
const FACTS = {
  redwood: "Fog supplies about 40% of the water it takes in. Its thick bark and tannin-rich wood protect it from fire and insects. If the trunk is cut or burned, new trees can sprout from the stump or roots as clones.",
  sequoia: "Its cones can stay green and sealed for twenty years or more, until the heat of a fire dries them and they drop their seeds. The seeds are tiny, just 4–5 mm long. It grows wild only in scattered groves on the western slope of California's Sierra Nevada.",
  baldcypress: "A conifer that drops its needles in autumn, which is why it's called \"bald\". In swamps its roots send up woody \"knees\" above the water, and scientists still don't agree on what they're for. Its rot-resistant heartwood earned the name \"wood eternal\".",
  pine: "Its needles grow in bundles of five, one for each letter of \"white\". In colonial New England the finest trees were marked with the King's broad arrow and reserved for Royal Navy masts. Anger over that law led to the Pine Tree Riot of 1772.",
  ash: "It can't resprout after an intense bushfire, so the fire kills it. But the heat releases its seeds onto the nutrient-rich ash, and a whole new forest springs up at once. Its rough lower bark sheds in long ribbons, leaving the upper trunk smooth and pale.",
  oak: "In the UK, oaks support more than 2,300 other species. Its acorns hang on long stalks, which gives it its other name, pedunculate oak. Jays hide acorns to eat later, and the ones they forget grow into new oaks.",
  maple: "It takes about 40 litres of sap to make one litre of maple syrup. In dry spells its deep roots draw up water at night and release it into the dry topsoil, where shallow-rooted neighbours can use it. Its autumn leaves range from yellow through orange to red.",
  birch: "Its thin white bark peels in paper-like layers. The bark is oily, waterproof and tough, and Indigenous peoples such as the Wabanaki have long used it to make canoes, containers and wigwams.",
  poplar: "Every Lombardy poplar is a clone of one male tree selected in Lombardy, northern Italy, in the 1600s. Because they're all male, they make no seeds and are grown from cuttings. Its narrow shape comes from branches that grow almost parallel to the trunk.",
  willow: "Its Latin name, babylonica, is a mistake: Linnaeus thought it was the willow of Psalm 137, \"by the rivers of Babylon\", but it comes from China, and the trees of Babylon were Euphrates poplars. Willow bark contains salicin, a compound related to aspirin.",
  palm: "A palm has no growth layer under its bark, so its trunk stops thickening while it's young. Every leaf comes from a single bud at the top, and if that bud dies, the palm dies. Austronesian sailors carried coconuts from the Philippines to the Americas over 2,000 years ago.",
  apple: "Its wild ancestor, Malus sieversii, still grows in southern Kazakhstan. Apples don't grow true from seed: plant a Red Delicious pip and you won't get Red Delicious. So every named variety is grafted, with buds of one tree joined onto the roots of another.",
  bristlecone: "Its needles grow in fives and can stay on the branch for more than 40 years. On old trees most of the trunk dies back, and a narrow strip of living bark may be all that links the roots to a few live branches. It thrives on dry, rocky high slopes where few other plants can grow.",
  spruce: "It's Europe's favourite Christmas tree, and every year since 1947 Oslo has sent one to London's Trafalgar Square as thanks for Britain's help in World War II. Stradivari made the tops of his violins from Norway spruce from the Italian Alps.",
  beech: "Beech woods are so shady, and so thickly carpeted with fallen leaves, that few other plants grow there. The word \"book\" probably comes from the old Germanic word for beech, perhaps from runes carved on beechwood tablets. Beeches often hold on to their dead leaves all winter.",
  scotspine: "It's the most widespread pine in the world, growing from Spain and Scotland to the far east of Russia. Its upper trunk turns a distinctive reddish orange. It is Scotland's national tree.",
  teak: "Its wood is rich in natural oils, so it resists water, rot and pests, and it has been used to build boats for over 2,000 years. The wood also contains silica, which quickly blunts saws and chisels. Its leaves can be 45 cm long, and it sheds them in the dry season.",
  larch: "Europe's only conifer that loses its needles: they turn yellow in autumn and fall. Its tough, durable wood is still used in some Alpine villages to make alphorns, wooden horns 3–4 m long. Its seed cones can stay on the tree for up to 10 years.",
  silverbirch: "Its light, winged seeds are carried far on the wind, so it's quick to move into open ground. In early spring its rising sap was commonly tapped in Eastern Europe, to drink fresh, ferment into birch wine or boil into syrup. Finland voted it the national tree in 1988.",
  alder: "Bacteria in its roots fix nitrogen from the air, enriching the wet soils it grows in. Its wood lasts a long time under water and has been used for jetties and underwater supports, for example in Venice. Its young buds are sticky, which gives it the Latin name glutinosa.",
  euash: "Since the 1990s a fungal disease, ash dieback, has spread across Europe, and in many countries it has killed most of the ash trees. Its strong, flexible wood is still used for tool handles and sports equipment. In Norse myth, Yggdrasil, the tree at the centre of the cosmos, is an ash.",
  kauri: "It sheds its bark in flakes, which stops vines and other plants from taking hold, and drops its lower branches as it grows, leaving a clean trunk. Its resin, dug up as \"kauri gum\", was prized for varnish and fuelled a gum-digging industry in New Zealand. Today it is threatened by kauri dieback disease.",
  parana: "It isn't a true pine but an araucaria, a relative of the monkey puzzle tree. Its seeds, pinhão, are a popular winter snack in southern Brazil, and are spread by animals, especially the azure jay. Logging and farming have destroyed about 97% of its habitat, and it is critically endangered.",
};

// ---------- history: as a run passes each marker, one of its facts fades in ("25 years ago, ...").
// Markers every 25 years up to 400, then every 100 (eras, "About N years ago"). Exact facts carry their
// year, so "N years ago" is counted from today. Each was checked; the reviewed list is in HISTORY.md.
const HISTORY = [
  [25, [[2001, 'Wikipedia went online'], [2001, 'Apple released the first iPod'], [2001, "Studio Ghibli's Spirited Away opened in Japan"], [2001, 'Beijing won the vote to host the 2008 Olympics']]],
  [50, [[1976, 'Apple Computer was founded'], [1976, "Nadia Comăneci, aged 14, scored gymnastics' first perfect 10 at the Montreal Olympics"], [1976, 'the Soweto uprising against apartheid began in South Africa'], [1976, 'Concorde began flying passengers faster than sound']]],
  [75, [[1951, 'the first Asian Games opened in New Delhi'], [1951, 'Libya became an independent country'], [1951, "Kurosawa's Rashomon won the top prize at the Venice Film Festival"], [1951, 'UNIVAC I, one of the first commercial computers, went to work for the US Census Bureau']]],
  [100, [[1926, 'John Logie Baird gave the first public demonstration of television'], [1926, 'Hirohito became emperor of Japan'], [1926, 'Gertrude Ederle became the first woman to swim the English Channel'], [1926, 'Robert Goddard launched the first liquid-fuelled rocket']]],
  [125, [[1901, 'the first Nobel Prizes were awarded'], [1901, "Australia's colonies joined to become one country"], [1901, 'Marconi received the first radio signal sent across the Atlantic'], [1901, 'the Boxer Protocol was signed, ending the Boxer Rebellion in China']]],
  [150, [[1876, 'Alexander Graham Bell patented the telephone'], [1876, 'Lakota and Cheyenne warriors defeated Custer at the Little Bighorn'], [1876, "baseball's National League was founded"], [1876, 'the Ottoman Empire adopted its first constitution']]],
  [175, [[1851, 'Moby-Dick was published'], [1851, 'the Taiping Rebellion began in China'], [1851, "Australia's first gold rush began"], [1851, "the yacht America won the race that became the America's Cup"]]],
  [200, [[1826, 'Thomas Jefferson and John Adams both died on the 4th of July'], [1826, 'the Ottoman sultan crushed the Janissaries, his own elite troops'], [1826, 'the Treaty of Yandabo ended the first Anglo-Burmese war'], [1826, 'Simón Bolívar gathered the new Latin American republics at the Congress of Panama']]],
  [225, [[1801, 'Ranjit Singh became Maharaja of the Punjab'], [1801, 'Joseph Jacquard showed his punch-card loom, an ancestor of the computer'], [1801, 'Toussaint Louverture gave Saint-Domingue, soon to be Haiti, a constitution'], [1801, 'Giuseppe Piazzi discovered Ceres, the first known asteroid']]],
  [250, [[1776, 'the American colonies declared independence'], [1776, 'Adam Smith published The Wealth of Nations'], [1776, 'Spain created the Viceroyalty of the Río de la Plata in South America'], [1776, 'Ueda Akinari published the Japanese ghost stories Ugetsu Monogatari']]],
  [275, [[1751, "the first volume of Diderot's Encyclopédie appeared"], [1751, 'Benjamin Franklin published his experiments with electricity'], [1751, "China's Qianlong Emperor visited Nanjing on his first grand tour of the south"], [1751, 'Carl Linnaeus, who gave plants their two-part Latin names, published Philosophia Botanica']]],
  [300, [[1726, "Gulliver's Travels was published"], [1726, 'Montevideo was founded'], [1726, 'Isaac Newton told a friend how a falling apple set him thinking about gravity'], [1726, 'China printed the largest encyclopedia of its kind ever made: 800,000 pages, in copper movable type']]],
  [325, [[1701, "a young lord attacked an official in the shogun's castle, starting the story of the 47 rōnin"], [1701, 'the Asante defeated Denkyira at Feyiase and became the leading Akan power'], [1701, 'New France, its First Nations allies and the Iroquois made the Great Peace of Montreal'], [1701, 'Jethro Tull invented the seed drill']]],
  [350, [[1676, 'Antonie van Leeuwenhoek first saw microorganisms through his microscope'], [1676, 'Ole Rømer made the first measurement of the speed of light'], [1676, "rebels in Bacon's Rebellion burned Jamestown, Virginia"], [1676, 'Feodor III became Tsar of Russia']]],
  [375, [[1651, 'Thomas Hobbes published Leviathan'], [1651, 'after losing a battle, the future Charles II of England hid from his enemies in an oak tree'], [1651, 'Tokugawa Ietsuna became shogun of Japan'], [1651, 'Kösem Sultan, one of the most powerful women in Ottoman history, was assassinated']]],
  [400, [[1626, 'Dutch colonists bought Manhattan from the Lenape'], [1626, "St Peter's Basilica in Rome was consecrated"], [1626, 'Nurhaci, founder of the Qing dynasty, died'], [1626, 'Francis Bacon died, said to have caught a fatal chill stuffing a chicken with snow']]],
  [500, ['Babur won the battle of Panipat and founded the Mughal Empire', 'the Ottomans defeated Hungary at Mohács', 'the Inca Empire was at its greatest extent, under Huayna Capac', 'William Tyndale printed the New Testament in English']],
  [600, ["Admiral Zheng He's treasure fleets sailed from China as far as East Africa", 'the Aztec Triple Alliance was formed', 'Joan of Arc led the French army', "King Sejong's Korea saw great advances in science and invention"]],
  [700, ['Ibn Battuta set out on travels across Africa and Asia that lasted 30 years', 'Mansa Musa of Mali made his famously rich pilgrimage to Mecca', "the Mexica founded Tenochtitlan, today's Mexico City", 'Dante finished the Divine Comedy']],
  [800, ['Genghis Khan, founder of the Mongol Empire, died', "England's barons forced King John to seal Magna Carta", 'Sundiata Keita founded the Mali Empire', "Great Zimbabwe's stone walls were rising in southern Africa"]],
  [900, ['the Song dynasty lost its capital Kaifeng to the Jin', 'Angkor Wat was being built in Cambodia', 'the Persian poet and mathematician Omar Khayyam was alive', "Chaco Canyon's great houses were at their peak in what is now New Mexico"]],
  [1000, ['Murasaki Shikibu had just written The Tale of Genji', "Leif Erikson's Norse sailors had reached North America", 'Ibn Sina finished The Canon of Medicine', 'the Chola navy of southern India attacked the Srivijaya empire']],
  [1100, ['the Khitan Liao conquered the kingdom of Balhae', 'Æthelstan became the first king of all England', 'Córdoba in Muslim Spain was becoming one of Europe\'s largest cities', 'Chichen Itza was rising in the Yucatán']],
  [1200, ['al-Khwarizmi wrote the book that gave us the word "algebra"', 'Borobudur was being built in Java', 'Jayavarman II founded the Khmer Empire', 'Charlemagne had been crowned emperor in Rome']],
  [1300, ['the poet Li Bai was writing in Tang China', "Japan's oldest chronicle, the Kojiki, had just been written", 'the Franks stopped an Umayyad army at the battle of Tours', 'the Maya city of Tikal was at its height']],
  [1400, ['Muhammad and his followers had moved to Medina', 'Emperor Taizong took the throne of Tang China', 'Pakal the Great ruled the Maya city of Palenque', "Prince Shōtoku had written Japan's Seventeen-Article Constitution"]],
  [1500, ['Hagia Sophia was about to be built in Constantinople', 'King Kaleb of Aksum sent an army across the Red Sea to Yemen', 'the Indian mathematician Aryabhata had just written his great work on astronomy', 'Buddhism was about to reach Japan']],
  [1600, ["Attila's Huns were about to sweep across Europe", 'Teotihuacan was the largest city in the Americas', 'the poet Kalidasa was writing in Gupta India', 'the great university at Nalanda in India was founded']],
  [1700, ['Constantine was founding Constantinople', 'King Ezana of Aksum became a Christian', 'the Gupta Empire had just been founded in India', 'Wang Xizhi, China\'s "sage of calligraphy", was born']],
  [1800, ['the Sasanian Empire was founded in Persia', 'China was split into the Three Kingdoms', 'Queen Himiko ruled in Japan', 'the Moche were building great adobe pyramids in Peru']],
  [1900, ['the Pantheon was rebuilt in Rome', 'Cai Lun had improved papermaking in China', 'Zhang Heng built the first seismoscope to detect earthquakes', 'Kanishka ruled the Kushan Empire across Central Asia and India']],
  [2000, ['the Han dynasty had just been restored in China', 'Jesus was preaching in Galilee', 'the Nabataeans were carving the city of Petra into rock', 'the Nazca were drawing giant lines in the Peruvian desert']],
  [2100, ['the Silk Road had recently opened, linking Han China with Central Asia and the West', 'Julius Caesar was a young man in Rome', 'Sima Qian had written the first great history of China', 'Cleopatra was about to be born']],
  [2200, ['the Rosetta Stone had just been carved', 'Hannibal had crossed the Alps with war elephants', "China's first emperor had been buried with his Terracotta Army", 'Archimedes had been killed at Syracuse']],
  [2300, ["Ashoka was about to rule India's Maurya Empire", 'the Library of Alexandria had just been founded', 'the Colossus of Rhodes was standing', "Euclid had written the Elements"]],
  [2400, ['Plato was teaching at his Academy in Athens', 'the philosopher Mencius was born in China', 'Alexander the Great was about to be born', 'the Mausoleum at Halicarnassus was about to be built, giving us the word "mausoleum"']],
  [2500, ['Confucius had just died', 'the Buddha was teaching in India (his dates are debated)', 'the Spartans had made their stand at Thermopylae', 'the Nok culture of Nigeria was making terracotta sculptures']],
  [2600, ["Babylon's Ishtar Gate was built", 'Cyrus the Great was about to found the Persian Empire', 'Aesop was telling his fables', 'the Olmec city of La Venta was thriving in Mexico']],
  [2700, ["Japan's legendary first emperor, Jimmu, is said to have taken the throne", 'King Ashurbanipal was building his great library at Nineveh', 'the first coins were being made in Lydia', 'Kushite pharaohs from Nubia ruled Egypt']],
  [2800, ['the first Olympic Games were held', 'Rome was about to be founded, according to legend', "Homer's Iliad was taking shape", "China's Zhou kings moved their capital east"]],
  [2900, ['the Phoenicians were about to found Carthage', 'King Ashurnasirpal II of Assyria built a new capital at Nimrud', 'the temple of Chavín de Huántar was a great religious centre in Peru', 'the kingdom of Israel had just split in two']],
  [3000, ['the Phoenician alphabet, ancestor of the Greek, Latin, Hebrew and Arabic alphabets, was spreading', 'the Zhou dynasty ruled China', 'the Lapita people were settling Fiji, Tonga and Samoa', 'King Solomon was said to rule Israel']],
];
const THIS_YEAR = new Date().getFullYear();

// The text for one marker, picked at random: "25 years ago, Wikipedia went online."
function historyText(ago) {
  const facts = HISTORY.find(m => m[0] === ago)[1];
  const f = facts[Math.floor(Math.random() * facts.length)];
  if (Array.isArray(f)) {
    const n = THIS_YEAR - f[0];
    return { when: `${n.toLocaleString()} year${n === 1 ? '' : 's'} ago,`, what: f[1] + '.' };
  }
  return { when: `About ${ago.toLocaleString()} years ago,`, what: f + '.' };
}

// ---------- growth
// Chapman-Richards style curve: 0 at birth, 0.5 at t50, levelling off at 1.
function curve(age, t50, c) {
  if (age <= 0) return 0;
  const k = -Math.log(1 - Math.pow(0.5, 1 / c)) / t50;
  return Math.pow(1 - Math.exp(-k * age), c);
}

// With "Let trees die" off, a tree keeps living (and growing) past its lifespan; `overdue` marks that.
function stateAt(sp, year) {
  const overdue = year >= sp.life;
  const alive = !overdue || !letDie;
  const a = letDie ? Math.min(year, sp.life) : year;
  const h = Math.max(0.12, sp.H * curve(a, sp.t50, sp.c));
  const cw = sp.form === 'palm'
    ? sp.CW * clamp(0.3 + a / 8, 0, 1)                     // a palm's fronds are full length before its trunk forms
    : Math.max(0.1, sp.CW * curve(a, sp.t50 * 1.1, 1.2));
  const d = sp.form === 'palm'
    ? sp.D * clamp(0.3 + a / 8, 0, 1)                      // palms don't thicken once the trunk is up
    : Math.max(0.01, sp.D * curve(a, sp.dt50 || Math.min(sp.life * 0.3, sp.t50 * 4), sp.dc || 1.1));
  const decl = letDie ? clamp((a - sp.life * 0.85) / (sp.life * 0.15), 0, 1) : 0;
  return { age: year, h, cw, d, g: h / sp.H, decl, fol: alive ? 1 - 0.7 * decl : 0, alive, overdue };
}

// ---------- skeletons (built once per species, in metres at maturity)
const ENV = {
  round: u => Math.pow(Math.sin(Math.PI * (0.08 + 0.92 * u)), 0.7),
  dome: u => Math.pow(Math.sin(Math.PI * (0.2 + 0.8 * u)), 0.6),
  ovoid: u => Math.pow(Math.sin(Math.PI * (0.1 + 0.9 * u)), 0.9) * (1 - 0.35 * u),
  column: u => 0.55 + 0.45 * Math.sin(Math.PI * u),
  cup: u => 0.3 + 0.7 * Math.pow(u, 0.6),          // longest branches at the top (candelabra)
};

function genBroad(sp) {
  const P = sp.P, r = mulberry32(sp.seed);
  const segs = [], tips = [];
  const add = (x1, y1, x2, y2, w1, w2, depth, birth) => segs.push({ x1, y1, x2, y2, w1, w2, depth, birth });
  const wob = P.wob || 0.015;

  function sub(x, y, ang, len, depth, w, birth) {
    const x2 = x + Math.sin(ang) * len, y2 = y + Math.cos(ang) * len;
    const w2 = w * 0.7;
    add(x, y, x2, y2, w, w2, depth, birth);
    if (depth >= P.depth + 1) { tips.push({ x: x2, y: y2, birth: birth + 0.05, depth }); return; }
    const side = r() < 0.5 ? 1 : -1;
    let a1 = ang + side * P.spread * (0.3 + 0.3 * r());
    let a2 = ang - side * P.spread * (0.7 + 0.5 * r());
    a1 = lerp(a1, 0, P.up) + (r() - 0.5) * P.jit * 0.4;
    a2 = lerp(a2, 0, P.up) + (r() - 0.5) * P.jit * 0.4;
    const nb = birth + 0.1 + r() * 0.05;
    sub(x2, y2, a1, len * P.ratio * (0.9 + r() * 0.2), depth + 1, w2, nb);
    sub(x2, y2, a2, len * P.ratio * (0.6 + r() * 0.3), depth + 1, w2 * 0.8, nb + 0.03);
    if (depth >= P.depth) tips.push({ x: x2, y: y2, birth: nb, depth });
  }

  // trunk, then the main axis up through the crown, with laterals at each node
  let x = (r() - 0.5) * wob, y = P.trunk, w = 0.82;
  add(0, 0, x, y, 1, w, 0, 0);
  const top = 0.97;
  for (let i = 0; i < P.nodes; i++) {
    const u0 = i / P.nodes, u1 = (i + 1) / P.nodes;
    const nx = x + (r() - 0.5) * wob * 2, ny = P.trunk + (top - P.trunk) * u1, nw = lerp(0.82, 0.12, u1);
    const count = 1 + (r() < 0.6 ? 1 : 0);
    for (let k = 0; k < count; k++) {
      const side = (i + k) % 2 ? 1 : -1;
      const ang = side * lerp(P.angLow, P.angHigh, u0) + (r() - 0.5) * P.jit * 0.5;
      const len = ENV[P.env](u0) * 0.35 * (0.8 + 0.4 * r());
      sub(x, y, ang, len, 2, w * 0.6, 0.03 + u0 * 0.05 + r() * 0.04);
    }
    add(x, y, nx, ny, w, nw, 1, 0);
    x = nx; y = ny; w = nw;
  }
  tips.push({ x, y, birth: 0, depth: 1 });

  // stretch into the species' mature height and crown width, leaving room for the leaf clusters
  let mx = 0.01, my = 0.01;
  for (const s of segs) { mx = Math.max(mx, Math.abs(s.x1), Math.abs(s.x2)); my = Math.max(my, s.y1, s.y2); }
  const R = sp.CW * P.leafR, Ry = R * P.asp;
  const fx = (sp.CW / 2 - R) / mx, fy = (sp.H - Ry) / my;
  for (const s of segs) { s.x1 *= fx; s.x2 *= fx; s.y1 *= fy; s.y2 *= fy; }
  for (const t of tips) { t.x *= fx; t.y *= fy; }
  // Most leaf clusters bunch near the trunk; spread them outward (|x|^p, p < 1, keeps the outer edge
  // and the trunk in place) so the crown reads as wide as it really is.
  const p = P.spreadOut ?? 0.8, edge = sp.CW / 2 - R;
  const out = x => Math.sign(x) * edge * Math.pow(Math.min(1, Math.abs(x) / edge), p);
  for (const s of segs) { s.x1 = out(s.x1); s.x2 = out(s.x2); }
  for (const t of tips) t.x = out(t.x);
  return { segs, tips, R, Ry };
}

function genConifer(sp) {
  const P = sp.P, r = mulberry32(sp.seed), wh = [];
  for (let i = 0; i < P.whorls; i++) {
    const u = 0.06 + 0.9 * (i + r() * 0.6) / P.whorls;
    let len = Math.pow(1 - u, P.cone) * (0.8 + r() * 0.3);
    if (P.ragged) len *= 1 - P.ragged * r() * 0.8;
    for (const side of [-1, 1]) wh.push({ u, len: len * (0.85 + r() * 0.3), side, ang: P.droop + (r() - 0.5) * 0.25, front: false });
    // one foreshortened branch pointing at the viewer
    if (r() < 0.6) wh.push({ u: u + 0.01, len: len * 0.5, side: r() < 0.5 ? -1 : 1, ang: P.droop + 0.2, front: true });
  }
  let m = 0;
  for (const w of wh) m = Math.max(m, w.len);
  for (const w of wh) w.len *= (sp.CW / 2) / m;
  return { wh };
}

const skeletons = {};
function skeleton(sp) {
  if (!skeletons[sp.id]) skeletons[sp.id] = sp.form === 'broad' ? genBroad(sp) : sp.form === 'conifer' ? genConifer(sp) : {};
  return skeletons[sp.id];
}

// ---------- canvas + paper
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let dpr = 1, paper = null;

function makePaper(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
  const g = c.getContext('2d');
  g.fillStyle = PAPER; g.fillRect(0, 0, c.width, c.height);
  const r = mulberry32(5);
  const n = (c.width * c.height) / 700;
  for (let i = 0; i < n; i++) {
    g.fillStyle = r() < 0.55 ? `rgba(60,50,30,${0.02 + r() * 0.03})` : 'rgba(255,255,255,0.12)';
    g.fillRect(r() * c.width, r() * c.height, (1 + r() * 1.5) * dpr, (0.6 + r()) * dpr);
  }
  g.lineWidth = dpr * 0.6;
  for (let i = 0; i < 160; i++) {
    const x = r() * c.width, y = r() * c.height, a = r() * TAU, l = (6 + r() * 20) * dpr;
    g.strokeStyle = `rgba(90,80,60,${0.03 + r() * 0.04})`;
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  const v = g.createRadialGradient(c.width / 2, c.height / 2, Math.min(c.width, c.height) * 0.35, c.width / 2, c.height / 2, Math.max(c.width, c.height) * 0.75);
  v.addColorStop(0, 'rgba(120,100,70,0)');
  v.addColorStop(1, 'rgba(120,100,70,0.10)');
  g.fillStyle = v; g.fillRect(0, 0, c.width, c.height);
  return c;
}

function resize() {
  dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth, h = cv.clientHeight;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  paper = makePaper(w, h);
}
new ResizeObserver(resize).observe(cv);

// ---------- pencil strokes
// Every stroke takes a seed so its wobble is the same every frame (no boiling).
function pline(x1, y1, x2, y2, seed, w = 1, a = 0.85, passes = 2, wob = 1) {
  const r = mulberry32(seed);
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const bowMax = Math.min(3, 0.4 + len * 0.012) * wob;
  const over = Math.min(3, len * 0.04);
  ctx.lineWidth = w;
  for (let p = 0; p < passes; p++) {
    const o1 = (r() - 0.5) * 0.9 * wob, o2 = (r() - 0.5) * 0.9 * wob;
    const e1 = (r() * 0.8 - 0.2) * over, e2 = (r() * 0.8 - 0.2) * over;
    const bow = (r() - 0.5) * 2 * bowMax;
    const sx = x1 - ux * e1 + nx * o1, sy = y1 - uy * e1 + ny * o1;
    const ex = x2 + ux * e2 + nx * o2, ey = y2 + uy * e2 + ny * o2;
    ctx.globalAlpha = a * (p ? 0.5 : 1);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo((sx + ex) / 2 + nx * bow, (sy + ey) / 2 + ny * bow, ex, ey);
    ctx.stroke();
  }
}

// A tapered trunk or branch: two edges plus shading or bark marks on the right (shadow) side.
function limb(x1, y1, x2, y2, w1, w2, seed, alpha, bark) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 0.4) return;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const wm = Math.max(w1, w2);
  if (wm < 2.5) {
    pline(x1, y1, x2, y2, seed, Math.max(0.6, (w1 + w2) / 2), alpha, 1);
    return;
  }
  const h1 = w1 / 2, h2 = w2 / 2;
  pline(x1 + nx * h1, y1 + ny * h1, x2 + nx * h2, y2 + ny * h2, seed, 1, alpha, 2);
  pline(x1 - nx * h1, y1 - ny * h1, x2 - nx * h2, y2 - ny * h2, seed + 1, 1, alpha, 2);
  const r = mulberry32(seed + 2);
  ctx.lineWidth = 0.7;
  ctx.globalAlpha = alpha * 0.45;
  ctx.beginPath();
  const at = t => [x1 + dx * t, y1 + dy * t, lerp(w1, w2, t)];
  if (bark === 'rings') {
    const step = Math.max(3, wm * 0.45);
    for (let s = step * 0.5; s < len; s += step) {
      const [cx, cy, w] = at(s / len);
      ctx.moveTo(cx - nx * w / 2, cy - ny * w / 2);
      ctx.quadraticCurveTo(cx - ux * 1.5, cy - uy * 1.5, cx + nx * w / 2, cy + ny * w / 2);
    }
  } else {
    // hatched shadow down the right side
    const shade = bark === 'birch' ? 0.18 : bark === 'smooth' ? 0.25 : 0.42;
    for (let s = 1; s < len; s += 2.6) {
      const [cx, cy, w] = at(s / len);
      const ex = cx + nx * w / 2, ey = cy + ny * w / 2;
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - nx * w * shade + ux * 2.5, ey - ny * w * shade + uy * 2.5);
    }
    if (bark === 'birch') {
      for (let k = 0, n = Math.floor(len / 5); k < n; k++) {
        const [cx, cy, w] = at(r());
        const o = (r() - 0.5) * 0.7 * w, l = w * (0.12 + r() * 0.2);
        ctx.moveTo(cx + nx * o, cy + ny * o);
        ctx.lineTo(cx + nx * (o + l), cy + ny * (o + l));
      }
    }
    if ((bark === 'furrow' || bark === 'smooth') && wm > 6) {
      const n = bark === 'smooth' ? 1 : Math.min(5, Math.floor(wm / 5));
      for (let k = 0; k < n; k++) {
        const o = ((k + 0.5) / n - 0.5) * 0.7 + (r() - 0.5) * 0.08;
        const steps = Math.max(3, Math.round(len / 8));
        for (let j = 0; j <= steps; j++) {
          const t = j / steps, [cx, cy, w] = at(t), wig = (r() - 0.5) * 1.6;
          const px = cx + nx * (o * w + wig), py = cy + ny * (o * w + wig);
          j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
      }
    }
  }
  ctx.stroke();
}

// Looping scribble for a mass of leaves.
function scribble(cx, cy, rx, ry, seed, alpha) {
  if (rx < 1.2 && ry < 1.2) {
    ctx.globalAlpha = alpha;
    ctx.fillRect(cx - 0.8, cy - 0.8, 1.6, 1.6);
    return;
  }
  const r = mulberry32(seed);
  const n = clamp(Math.round(Math.sqrt(rx * ry) * 0.8) + 2, 2, 12);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  let a = r() * TAU;
  ctx.moveTo(cx + Math.cos(a) * rx * 0.5, cy + Math.sin(a) * ry * 0.5);
  for (let i = 0; i < n; i++) {
    a += 1.9 + r() * 1.2;
    const rr = 0.25 + 0.75 * Math.sqrt(r()), ca = a - 0.9, cr = rr + 0.35;
    ctx.quadraticCurveTo(cx + Math.cos(ca) * rx * cr, cy + Math.sin(ca) * ry * cr, cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr);
  }
  ctx.stroke();
}

// Short strokes radiating from a twig end (needle tufts).
function tuft(cx, cy, rx, ry, seed, alpha, fol, many = 15) {
  const r = mulberry32(seed), n = Math.round((5 + 10 * fol) * many / 15);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, r0 = 0.15 + r() * 0.2;
    ctx.moveTo(cx + Math.cos(a) * rx * r0, cy + Math.sin(a) * ry * r0);
    ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
  }
  ctx.stroke();
}

// Willow strands hanging from a twig.
function weep(x, y, rx, ry, len, seed, alpha, n) {
  const r = mulberry32(seed);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const sx = x + (r() - 0.5) * rx * 1.6, sy = y + (r() - 0.3) * ry;
    const L = len * (0.5 + r() * 0.6), out = (sx - x) * 0.3 + (r() - 0.5) * 3;
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + out, sy + L * 0.4, sx + out * 1.4, sy + L);
  }
  ctx.stroke();
}

function pcircle(x, y, rad, seed, alpha) {
  const r = mulberry32(seed);
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  const a0 = r() * TAU;
  ctx.ellipse(x, y, rad * (0.9 + r() * 0.2), rad, r(), a0, a0 + TAU * 1.08);
  ctx.stroke();
}

// ---------- trees
function drawBroad(tr, st, cx, gy, pxm, alpha) {
  const sp = tr.sp, P = sp.P, sk = tr.sk;
  const sx = st.cw / sp.CW * pxm, sy = st.h / sp.H * pxm, wpx = st.d * pxm;
  if (P.flare) {
    const fh = Math.min(sk.segs[0].y2 * 0.2, 2.5) * sy;     // up to 2.5 m of swollen, buttressed base
    limb(cx, gy, cx, gy - fh, wpx * P.flare, wpx, tr.seed + 3, alpha, sp.bark);
  }
  sk.segs.forEach((s, i) => {
    const vis = s.birth === 0 ? 1 : clamp((st.g - s.birth) / 0.1, 0, 1);
    if (vis <= 0) return;
    if (s.depth >= 2 && st.decl > 0 && hash(tr.seed + i * 31) < st.decl * 0.35 * (s.depth - 1) / P.depth) return;
    const x1 = cx + s.x1 * sx, y1 = gy - s.y1 * sy;
    const x2 = cx + lerp(s.x1, s.x2, vis) * sx, y2 = gy - lerp(s.y1, s.y2, vis) * sy;
    limb(x1, y1, x2, y2, s.w1 * wpx, lerp(s.w1, s.w2, vis) * wpx, tr.seed + i * 7, alpha, s.depth === 0 ? sp.bark : (s.w1 * wpx > 5 ? sp.bark : 'hatch'));
  });
  if (st.fol <= 0) return;
  const fa = alpha * (0.35 + 0.25 * st.fol) * (P.ink || 1);
  sk.tips.forEach((tp, i) => {
    const vis = tp.birth === 0 ? 1 : clamp((st.g - tp.birth) / 0.1, 0, 1);
    if (vis <= 0) return;
    const hs = hash(tr.seed * 3 + i * 101);
    if (hs > st.fol + 0.001 || (P.sparse && hs < P.sparse * 0.5)) return;
    const x = cx + tp.x * sx, y = gy - tp.y * sy;
    const rx = Math.max(1.5, sk.R * sx * vis), ry = Math.max(1.5, sk.Ry * sy * vis);
    const seed = tr.seed + i * 13;
    if (P.leaf === 'tuft') { tuft(x, y, rx, ry, seed, fa, st.fol, P.tuftN); return; }
    if (P.leaf === 'weep') {
      scribble(x, y, rx * 0.7, ry * 0.6, seed, fa * 0.7);
      const len = Math.min(P.weep * st.h * pxm, gy - y - 2);
      if (len > 2) weep(x, y, rx, ry, len, seed + 1, fa, Math.round(2 + 3 * st.fol));
      return;
    }
    scribble(x, y, rx, ry, seed, fa);
    if (rx > 6) scribble(x + rx * 0.2, y + ry * 0.25, rx * 0.6, ry * 0.55, seed + 1, fa * 0.8);   // shadow side
    if (P.fruit && st.alive && st.age > 5 && hs < 0.35) {
      const fr = 0.07 * pxm;
      if (fr > 0.8) pcircle(x + (hs - 0.17) * rx * 3, y + ry * 0.4, fr, seed + 2, alpha * 0.8);
    }
  });
}

function drawConifer(tr, st, cx, gy, pxm, alpha) {
  const sp = tr.sp, P = sp.P, sk = tr.sk;
  const sx = st.cw / sp.CW * pxm, sy = st.h / sp.H * pxm, wpx = st.d * pxm;
  limb(cx, gy, cx, gy - st.h * pxm, wpx, Math.max(0.6, wpx * 0.06), tr.seed, alpha, sp.bark);
  const lift = P.lift * smooth(st.age / (sp.life * 0.5));   // old conifers shed their lower branches
  // Branch length follows the cone over the living crown (lift..top), not the whole trunk, so an old
  // conifer keeps its full crown width on top of a clear trunk. (1-u)^cone over the crown = this factor.
  const reach = Math.pow(1 / (1 - lift), P.cone);
  sk.wh.forEach((w, i) => {
    if (w.u < lift) return;
    const by = gy - w.u * sp.H * sy, L = Math.min(w.len * reach, sp.CW / 2) * sx;
    if (L < 0.5) return;
    const ex = cx + w.side * L * Math.cos(w.ang), ey = by + L * Math.sin(w.ang);
    const a = alpha * (w.front ? 0.6 : 0.9);
    pline(cx, by, ex, ey, tr.seed + i * 7, Math.max(0.6, wpx * 0.15 * (1 - w.u)), a, 1);
    if (st.fol <= 0) return;
    const m = clamp(Math.round(L / 3), 2, 36);
    let dx = w.side * (P.tick > 0 ? 0.4 : 0.5), dy = P.tick > 0 ? 1 : -0.8;
    const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
    const nl = clamp(P.needle * sy, 1.2, 14);
    ctx.globalAlpha = a * (0.4 + 0.3 * st.fol);
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let j = 1; j <= m; j++) {
      if (hash(tr.seed + i * 131 + j) > st.fol) continue;
      const t = j / m, px = lerp(cx, ex, t), py = lerp(by, ey, t);
      const l = nl * (0.6 + 0.8 * Math.sin(Math.PI * t));
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx * l, py + dy * l);
    }
    ctx.stroke();
  });
}

function drawPalm(tr, st, cx, gy, pxm, alpha) {
  const sp = tr.sp;
  const crown = st.cw * pxm;
  const trunkH = Math.max(0, st.h * pxm - crown * 0.18);
  const lean = sp.P.lean * trunkH;
  const pt = u => [cx + lean * u * u, gy - trunkH * u];
  const w = Math.max(0.8, st.d * pxm);
  if (trunkH > 1) {
    for (let i = 0; i < 6; i++) {
      const [x1, y1] = pt(i / 6), [x2, y2] = pt((i + 1) / 6);
      limb(x1, y1, x2, y2, w * (i ? 1 : 1.3), w, tr.seed + i * 7, alpha, 'rings');
    }
  }
  if (st.fol <= 0) return;
  const [tx, ty] = pt(1);
  const r = mulberry32(tr.seed + 99);
  const n = Math.round(5 + 5 * st.fol);
  const fa = alpha * (0.5 + 0.3 * st.fol);
  for (let k = 0; k < n; k++) {
    // fronds arch up and out from the crown, the side ones drooping at the tips
    const ang = lerp(-2.0, 2.0, (k + 0.5) / n) + (r() - 0.5) * 0.3;
    const Lf = crown * 0.52 * (0.85 + 0.3 * r());
    const side = Math.abs(Math.sin(ang));
    const c1x = tx + Math.sin(ang) * Lf * 0.5, c1y = ty - Lf * (0.3 + 0.35 * Math.cos(ang));
    const ex = tx + Math.sin(ang) * Lf * 0.95, ey = ty - Math.cos(ang) * Lf * 0.35 + Lf * 0.45 * side;
    ctx.globalAlpha = fa;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(c1x, c1y, ex, ey);
    // leaflets both sides of the midrib, angled down
    const m = clamp(Math.round(Lf / 3), 3, 22);
    for (let j = 2; j <= m; j++) {
      const t = j / m, it = 1 - t;
      const bx = it * it * tx + 2 * it * t * c1x + t * t * ex, by = it * it * ty + 2 * it * t * c1y + t * t * ey;
      let gx = 2 * it * (c1x - tx) + 2 * t * (ex - c1x), gz = 2 * it * (c1y - ty) + 2 * t * (ey - c1y);
      const gl = Math.hypot(gx, gz) || 1; gx /= gl; gz /= gl;
      const l = Lf * 0.13 * (1 - t * 0.6);
      for (const s of [-1, 1]) {
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + (gx * 0.5 - gz * s) * l, by + (gz * 0.5 + gx * s) * l + l * 0.5);
      }
    }
    ctx.stroke();
  }
  if (st.alive && st.age > 6) {
    const cr = Math.max(0.9, 0.12 * pxm);
    for (let k = 0; k < 4; k++) pcircle(tx + (k - 1.5) * cr * 1.8, ty + cr * (1.2 + (k % 2) * 0.8), cr, tr.seed + k, alpha * 0.8);
  }
}

function drawTree(tr, st, cx, gy, pxm) {
  const alpha = st.alive ? 0.9 : 0.55;
  if (tr.sp.form === 'broad') drawBroad(tr, st, cx, gy, pxm, alpha);
  else if (tr.sp.form === 'conifer') drawConifer(tr, st, cx, gy, pxm, alpha);
  else drawPalm(tr, st, cx, gy, pxm, alpha);
}

// ---------- the sheet: grid, axis, ground, person, labels
const STEPS = [0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];

function drawGrid(L, R, T, gy, W, pxm) {
  let si = STEPS.findIndex(s => s * pxm >= 48);
  if (si < 0) si = STEPS.length - 1;
  const major = STEPS[si], minor = si > 0 ? STEPS[si - 1] : 0;
  const fade = minor ? clamp((minor * pxm - 14) / 30, 0, 1) : 0;
  const right = W - R;
  ctx.save();
  ctx.beginPath(); ctx.rect(L, T - 8, right - L, gy - T + 8); ctx.clip();
  const lines = (step, a, isMinor) => {
    for (let k = 1; ; k++) {
      const v = k * step;
      if (isMinor && Math.abs(v / major - Math.round(v / major)) < 1e-6) continue;
      const y = gy - v * pxm;
      if (y < T - 8) break;
      pline(L, y, right, y, Math.round(v * 1000), 0.7, a, 1, 0.6);
    }
    for (let k = 1; ; k++) {
      const v = k * step;
      if (isMinor && Math.abs(v / major - Math.round(v / major)) < 1e-6) continue;
      const x = L + v * pxm;
      if (x > right) break;
      pline(x, gy, x, T - 8, Math.round(v * 1000) + 7777, 0.7, a, 1, 0.6);
    }
  };
  if (fade > 0) lines(minor, 0.13 * fade, true);
  lines(major, 0.24, false);
  ctx.restore();

  // axis, ticks and labels
  pline(L, gy + 4, L, T - 10, 31, 1.1, 0.85, 2);
  ctx.font = '17px Caveat, cursive';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let k = 1; ; k++) {
    const v = k * major, y = gy - v * pxm;
    if (y < T - 4) break;
    pline(L - 6, y, L + 2, y, 400 + k, 1, 0.8, 1);
    ctx.globalAlpha = 0.8;
    ctx.fillText(`${v} m`, L - 9, y);
  }
}

function drawGround(L, R, gy, W) {
  pline(L - 8, gy, W - R + 6, gy, 12, 1.2, 0.9, 2, 0.8);
  const r = mulberry32(21);
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let x = L + 4; x < W - R; x += 7 + r() * 8) {
    for (let k = 0; k < 3; k++) {
      const bx = x + k * 1.5, h = 2 + r() * 4;
      ctx.moveTo(bx, gy);
      ctx.lineTo(bx + (r() - 0.5) * 3, gy - h);
    }
  }
  ctx.stroke();
}

// A 1.75 m person for scale.
function drawPerson(x, gy, pxm) {
  const h = 1.75 * pxm, a = 0.8;
  if (h < 4) { pline(x, gy, x, gy - Math.max(1.5, h), 50, 1, a, 1); return; }
  const hr = h * 0.075, neck = gy - h + hr * 2, hip = gy - h * 0.47, sh = gy - h * 0.8;
  pcircle(x, gy - h + hr, hr, 51, a);
  const lw = Math.max(0.8, h * 0.02);
  pline(x, neck, x, hip, 52, lw, a, 1);
  pline(x, hip, x - h * 0.08, gy, 53, lw, a, 1);
  pline(x, hip, x + h * 0.07, gy, 54, lw, a, 1);
  pline(x, sh, x - h * 0.11, gy - h * 0.5, 55, lw, a, 1);
  pline(x, sh, x + h * 0.1, gy - h * 0.52, 56, lw, a, 1);
}

// Label lines for one tree: name, Latin name, height, then its status.
// Each line shrinks to fit the column and, if it still doesn't fit, wraps.
function labelLines(sp, st, colW) {
  const fs = colW < 150 ? 17 : 21;
  const yrs = n => Math.floor(n).toLocaleString();
  const lines = [
    { text: sp.name, size: fs, weight: 600, alpha: 0.9 },
    { text: sp.sci, size: fs - 4, alpha: 0.55 },
  ];
  if (st.alive) {
    lines.push({ text: fmtM(st.h), size: fs - 1, alpha: 0.85 });
    const status = [];
    if (st.g > 0.97) status.push('full size');
    if (st.overdue) status.push(`† would have died at ${yrs(sp.life)}`);
    if (status.length) lines.push({ text: status.join(' · '), size: fs - 3, alpha: 0.6 });
  } else {
    lines.push({ text: `† died at ${yrs(sp.life)}`, size: fs - 1, alpha: 0.85 });
    lines.push({ text: `reached ${fmtM(st.h)}`, size: fs - 3, alpha: 0.6 });
  }
  const maxW = colW - 8, out = [];
  for (const ln of lines) {
    const font = sz => `${ln.weight || 400} ${sz}px Caveat, cursive`;
    let size = ln.size;
    ctx.font = font(size);
    while (size > 12 && ctx.measureText(ln.text).width > maxW) ctx.font = font(--size);
    // still too wide: wrap at spaces
    let row = '';
    for (const word of ln.text.split(' ')) {
      const test = row ? row + ' ' + word : word;
      if (row && ctx.measureText(test).width > maxW) { out.push({ text: row, font: font(size), size, alpha: ln.alpha }); row = word; }
      else row = test;
    }
    out.push({ text: row, font: font(size), size, alpha: ln.alpha });
  }
  return out;
}

const labelHeight = lines => lines.reduce((sum, ln) => sum + ln.size * 1.05 + 2, 6);

// Room under the ground for the tallest label any tree here could need (dead, or overdue at full size),
// so the ground line doesn't move during a run.
function labelRoom(colW) {
  let room = 0;
  for (const tr of trees) {
    const sp = tr.sp;
    const old = { age: maxYear(), h: sp.H, g: 1, alive: true, overdue: true };
    const dead = { age: maxYear(), h: sp.H, g: 1, alive: false, overdue: true };
    room = Math.max(room, labelHeight(labelLines(sp, old, colW)), labelHeight(labelLines(sp, dead, colW)));
  }
  return Math.ceil(room) + 8;
}

function drawLabel(tr, st, cx, gy, colW) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let y = gy + 6;
  for (const ln of labelLines(tr.sp, st, colW)) {
    y += ln.size * 1.05 + 2;
    ctx.font = ln.font;
    ctx.globalAlpha = ln.alpha;
    ctx.fillText(ln.text, cx, y);
  }
}

// ---------- state
let selected = ['redwood', 'ash', 'oak', 'birch', 'poplar'];
let trees = [];
let letDie = true;
let year = 0, playing = false, speed = 1, lastT = 0, scrubbing = false;
const view = { h: 0 };
let hits = [];                          // each tree's hover area on screen, set by render()

function buildTrees() {
  trees = SPECIES.filter(sp => selected.includes(sp.id)).map(sp => ({ sp, sk: skeleton(sp), seed: sp.seed }));
  scrub.max = maxYear();
  if (year > maxYear()) year = maxYear();
}
const maxYear = () => Math.max(...trees.map(t => t.sp.life)) + 20;

// Fits the scale to the chosen trees. Only used during a run (see render), so choosing trees
// doesn't give away how big they get; before the first run the scale fits every species.
function targetView(colW, plotH) {
  let h = 0, w = 0;
  for (const sp of pickerLocked() ? trees.map(tr => tr.sp) : SPECIES) { h = Math.max(h, sp.H); w = Math.max(w, sp.CW); }
  return Math.max(3, h * 1.12, w * plotH / (colW * 0.92));
}

function render(dt) {
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H || !paper || !paper.width || !paper.height) return;   // a hidden page can leave the paper 0 px
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
  ctx.drawImage(paper, 0, 0, W, H);
  const L = 58, R = 16, T = 26;
  const x0 = L + 34, colW = (W - R - x0) / trees.length;
  const B = Math.max(70, labelRoom(colW));
  const gy = H - B, plotH = gy - T;
  const states = trees.map(tr => stateAt(tr.sp, year));
  const target = pickerLocked() || !view.h ? targetView(colW, plotH) : view.h;   // between runs the scale stays put
  view.h = view.h ? view.h + (target - view.h) * (1 - Math.exp(-dt * 4)) : target;
  const pxm = plotH / view.h;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  drawGrid(L, R, T, gy, W, pxm);
  drawGround(L, R, gy, W);
  drawPerson(L + 17, gy, pxm);
  hits = trees.map((tr, i) => {
    const cx = x0 + colW * (i + 0.5);
    drawTree(tr, states[i], cx, gy, pxm);
    drawLabel(tr, states[i], cx, gy, colW);
    const top = Math.min(gy - states[i].h * pxm - 12, gy - 70);   // the tree as drawn now, plus its label
    return { sp: tr.sp, x0: cx - colW / 2, x1: cx + colW / 2, y0: top, y1: H };
  });
  drawHistory(dt, { x0, colW, T, gy, pxm, right: W - R });
  ctx.globalAlpha = 1;
}

// ---------- history text
const HIST_IN = 0.8, HIST_OUT = 0.8;                  // seconds
const histHold = () => (speed === 5 ? 3 : 4);          // time fully shown
let hist = null, histPending = 0, histPrev = 0, muteHistory = false;

// Note markers the run has just passed (only while playing, so scrubbing doesn't fire them).
function checkHistory() {
  if (year < histPrev) histPrev = year;                // restarted
  if (playing && !muteHistory) for (const [ago] of HISTORY) if (ago > histPrev && ago <= year) histPending = ago;
  histPrev = year;
}
function clearHistory() { hist = null; histPending = 0; histPrev = year; }

// Lay the text out in the biggest free spot above the ground that no tree reaches before it fades.
function placeHistory(text, g) {
  const later = year + (HIST_IN + histHold() + HIST_OUT) * speed, pad = 10;
  const boxes = trees.map((tr, i) => {
    const st = stateAt(tr.sp, later), cx = g.x0 + g.colW * (i + 0.5);
    const half = Math.max(st.cw * g.pxm / 2, st.d * g.pxm, 3) + pad;
    return { x1: cx - half, x2: cx + half, y1: g.gy - st.h * g.pxm - pad };
  });
  const full = g.right - g.x0 - 16;
  for (const size of [22, 19, 16, 14]) {
    // a block ("25 years ago," then the fact) at a few widths, then the whole thing as one line,
    // which can run along the strip of sky above the tallest tree
    for (const [maxW, inline] of [[380, 0], [300, 0], [230, 0], [170, 0], [120, 0], [90, 0], [full, 1]]) {
      const words = (inline ? text.when + ' ' + text.what : text.what).split(' ');
      const lines = inline ? [] : [{ text: text.when, weight: 600 }];
      ctx.font = `400 ${size}px Caveat, cursive`;
      let row = '';
      for (const word of words) {
        const test = row ? row + ' ' + word : word;
        if (row && ctx.measureText(test).width > maxW) { lines.push({ text: row, weight: 400 }); row = word; } else row = test;
      }
      lines.push({ text: row, weight: 400 });
      const w = Math.max(...lines.map(l => { ctx.font = `${l.weight} ${size}px Caveat, cursive`; return ctx.measureText(l.text).width; }));
      const lh = size * 1.1, h = lh * lines.length;
      if (w > full) continue;
      // top-most free spot first, then the one nearest the middle of the sheet
      const mid = (g.x0 + g.right) / 2;
      for (let y = g.T + 2; y + h < g.gy - 8; y += 4) {
        let best = null;
        for (let x = g.x0 + 8; x + w < g.right - 8; x += 6) {
          if (boxes.some(b => x < b.x2 && x + w > b.x1 && y + h > b.y1)) continue;
          if (best === null || Math.abs(x + w / 2 - mid) < Math.abs(best + w / 2 - mid)) best = x;
        }
        if (best !== null) return { lines, size, lh, x: best + w / 2, y };
      }
    }
  }
  return null;                                          // nowhere free: skip this one
}

function drawHistory(dt, g) {
  if (!hist && histPending) {
    const lay = placeHistory(historyText(histPending), g);
    histPending = 0;
    if (lay) hist = { ...lay, t: 0, hold: histHold() };
  }
  if (!hist) return;
  hist.t += dt;
  const t = hist.t;
  const a = t < HIST_IN ? t / HIST_IN : t < HIST_IN + hist.hold ? 1 : 1 - (t - HIST_IN - hist.hold) / HIST_OUT;
  if (a <= 0) { hist = null; return; }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = INK;
  hist.lines.forEach((l, i) => {
    ctx.font = `${l.weight} ${hist.size}px Caveat, cursive`;
    ctx.globalAlpha = a * (i ? 0.8 : 0.9);
    ctx.fillText(l.text, hist.x, hist.y + i * hist.lh);
  });
  ctx.restore();
}

// ---------- controls
const $ = s => document.querySelector(s);
const scrub = $('#scrub'), playBtn = $('#play');
let msgTimer = 0;

function say(text) {
  const m = $('#msg');
  m.textContent = text;
  m.classList.add('show');
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => m.classList.remove('show'), 1800);
}

function buildPicker() {
  const box = $('#picker');
  box.innerHTML = '<span class="lbl">pick 1–5 trees:</span>';
  for (const sp of SPECIES) {
    if (sp.group === 'more' && !box.querySelector('.row-break')) {
      const br = document.createElement('span');
      br.className = 'row-break';
      box.appendChild(br);
    }
    const b = document.createElement('button');
    b.textContent = sp.name;
    b.dataset.id = sp.id;
    b.title = sp.sci;
    b.onclick = () => { toggle(sp.id); b.blur(); };
    box.appendChild(b);
  }
  const m = document.createElement('span');
  m.id = 'msg';
  box.appendChild(m);
  refreshPicker();
}

function refreshPicker() {
  document.querySelectorAll('#picker button').forEach(b => b.classList.toggle('on', selected.includes(b.dataset.id)));
}

function toggle(id) {
  if (pickerLocked()) return;
  if (selected.includes(id)) {
    if (selected.length <= 1) return say('keep at least 1');
    selected = selected.filter(s => s !== id);
  } else {
    if (selected.length >= 5) return say('5 at most: take one away first');
    selected.push(id);
  }
  refreshPicker();
  buildTrees();
}

function setPlaying(p) {
  playing = p;
  playBtn.textContent = p ? '❚❚ pause' : '▶ play';
}

playBtn.onclick = () => {
  if (!playing && year >= maxYear()) year = 0;
  setPlaying(!playing);
  playBtn.blur();
};
// Reset clears the run (keeping the chosen trees) so new trees can be picked before playing again.
$('#reset').onclick = e => { year = 0; setPlaying(false); clearHistory(); e.target.blur(); };

// Once a run has started (playing, paused or finished), the trees can't be changed until Reset:
// adding a tree mid-run would show it fully grown and give the game away.
const pickerLocked = () => playing || year > 0;
let lockedShown = null;
function syncPickerLock() {
  const locked = pickerLocked();
  if (locked === lockedShown) return;
  lockedShown = locked;
  document.querySelectorAll('#picker button').forEach(b => { b.disabled = locked; });
  $('#picker').title = locked ? 'Press Reset to choose different trees' : '';
}

const SPEEDS = [1, 5, 20];
for (const s of SPEEDS) {
  const b = document.createElement('button');
  b.textContent = s + '×';
  b.title = `1 second = ${s} year${s > 1 ? 's' : ''}`;
  b.onclick = () => {
    speed = s;
    document.querySelectorAll('#speeds button').forEach(x => x.classList.toggle('on', x === b));
    b.blur();
  };
  if (s === speed) b.classList.add('on');
  $('#speeds').appendChild(b);
}

scrub.addEventListener('pointerdown', () => { scrubbing = true; });
window.addEventListener('pointerup', () => { scrubbing = false; });
scrub.addEventListener('input', () => { year = +scrub.value; clearHistory(); });

window.addEventListener('keydown', e => {
  if (!guide.hidden) {
    if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); closeGuide(); }
    return;
  }
  if (e.key === '?') { e.preventDefault(); openGuide(); return; }
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') { e.preventDefault(); playBtn.click(); }
});

$('#letDie').addEventListener('change', e => { letDie = e.target.checked; });
$('#muteHistory').addEventListener('change', e => { muteHistory = e.target.checked; if (muteHistory) clearHistory(); });

// ---------- information & guide panel
const guide = $('#guide'), helpBtn = $('#helpBtn');

function guideTab(name) {
  guide.querySelectorAll('.tabs button').forEach(b => {
    const on = b.dataset.tab === name;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on);
  });
  guide.querySelectorAll('.panel').forEach(p => { p.hidden = p.dataset.panel !== name; });
}

function openGuide(tab) {
  if (tab) guideTab(tab);
  guide.hidden = false;
  $('#guideClose').focus();
}

function closeGuide() {
  guide.hidden = true;
  helpBtn.focus();
}

helpBtn.onclick = () => openGuide();
$('#guideClose').onclick = closeGuide;
guide.addEventListener('click', e => { if (e.target === guide) closeGuide(); });   // click outside the sheet
guide.querySelectorAll('.tabs button').forEach(b => { b.onclick = () => guideTab(b.dataset.tab); });
guideTab('instructions');

// ---------- hover facts: point at a tree (or tap it) to read a short fact about it
const tip = $('#tip'), tipName = tip.querySelector('b'), tipText = tip.querySelector('span');
let pointer = null, tipFor = null;

function updateTip() {
  const r = cv.getBoundingClientRect();
  const x = pointer && pointer.x - r.left, y = pointer && pointer.y - r.top;
  const h = pointer && hits.find(h => x >= h.x0 && x < h.x1 && y >= h.y0 && y <= h.y1);
  if (!h || !guide.hidden) { tip.hidden = true; tipFor = null; return; }
  if (tipFor !== h.sp) {
    tipFor = h.sp;
    tipName.textContent = h.sp.name;
    tipText.textContent = FACTS[h.sp.id];
    tip.hidden = false;
  }
  // beside the pointer, flipped to stay on screen
  const w = tip.offsetWidth, ht = tip.offsetHeight, pad = 8;
  let left = pointer.x + 16, top = pointer.y + 16;
  if (left + w > innerWidth - pad) left = pointer.x - 16 - w;
  if (top + ht > innerHeight - pad) top = pointer.y - 16 - ht;
  tip.style.left = clamp(left, pad, innerWidth - w - pad) + 'px';
  tip.style.top = clamp(top, pad, innerHeight - ht - pad) + 'px';
}

cv.addEventListener('pointermove', e => { pointer = { x: e.clientX, y: e.clientY }; });
cv.addEventListener('pointerdown', e => { pointer = { x: e.clientX, y: e.clientY }; });
cv.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') pointer = null; });
window.addEventListener('pointerdown', e => { if (e.target !== cv) pointer = null; });   // a tap elsewhere hides it

function frame(t) {
  const dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 0;
  lastT = t;
  if (playing) {
    year += dt * speed;
    if (year >= maxYear()) { year = maxYear(); setPlaying(false); }
  }
  checkHistory();
  render(dt);
  updateTip();                          // trees grow under a still pointer, so check every frame
  const y = Math.floor(year);
  $('#year').textContent = `${y.toLocaleString()} year${y === 1 ? '' : 's'}`;
  syncPickerLock();
  if (!scrubbing) scrub.value = year;
  requestAnimationFrame(frame);
}

buildPicker();
buildTrees();
resize();
requestAnimationFrame(frame);
