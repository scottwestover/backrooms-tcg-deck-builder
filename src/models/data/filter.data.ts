import { MultiButtons } from '../../app/features/shared/multi-buttons.component';

export const Sets = ['LL', 'CP', 'ST1', 'ST2'];
export const GroupedSets = [
  {
    label: 'Standard',
    value: 'displays',
    items: [
      { label: 'LL', value: 'LL' },
      { label: 'CP', value: 'CP' },
    ],
  },
  {
    label: 'Starter Decks',
    value: 'starter',
    items: [
      { label: 'ST1', value: 'ST1' },
      { label: 'ST2', value: 'ST2' },
    ],
  },
  {
    label: 'Other',
    value: 'other',
    items: [{ label: 'Promo', value: 'Promo' }],
  },
];

export const Keywords: string[] = [
  '\uff1cAlliance\uff1e',
  '\uff1cArmor Purge\uff1e',
  '\uff1cBarrier\uff1e',
  '\uff1cBlast Digivolve\uff1e',
  '\uff1cBlast DNA Digivolve ([Alphamon] + [Ouryumon])\uff1e',
  '\uff1cBlast DNA Digivolve ([Angewomon] + [LadyDevimon])\uff1e',
  '\uff1cBlast DNA Digivolve ([Breakdramon] + [Slayerdramon])\uff1e',
  '\uff1cBlast DNA Digivolve ([DinoBeemon] + [Paildramon])\uff1e',
  '\uff1cBlast DNA Digivolve ([Durandamon] + [BryweLudramon])\uff1e',
  '\uff1cBlast DNA Digivolve ([Fenriloogamon] + [Kazuchimon])\uff1e',
  '\uff1cBlast DNA Digivolve ([WarGreymon] + [MetalGarurumon])\uff1e',
  '\uff1cBlitz\uff1e',
  '\uff1cBlocker\uff1e',
  '\uff1cCollision\uff1e',
  '\uff1cDecode (Blue Lv.4)\uff1e',
  '\uff1cDecode (Blue Lv.5)\uff1e',
  '\uff1cDecoy ([Bagra Army] trait)\uff1e',
  '\uff1cDecoy (Black)\uff1e',
  '\uff1cDecoy (Black/White)\uff1e',
  '\uff1cDecoy (Red/Black)\uff1e',
  '\uff1cDecoy ([D-Brigade] trait)\uff1e',
  '\uff1cDecoy ([Deva] or [Four Sovereigns] trait)\uff1e',
  '\uff1cDecoy ([Puppet] trait)\uff1e',
  '\uff1cDe-Digivolve 1\uff1e',
  '\uff1cDe-Digivolve 2\uff1e',
  '\uff1cDe-Digivolve 3\uff1e',
  '\uff1cDe-Digivolve 4\uff1e',
  '\uff1cDelay\uff1e',
  '\uff1cDigi-Burst 1\uff1e',
  '\uff1cDigi-Burst 2\uff1e',
  '\uff1cDigi-Burst 3\uff1e',
  '\uff1cDigi-Burst 4\uff1e',
  '\uff1cDigi-Burst up to 4\uff1e',
  '\uff1cDigisorption -2\uff1e',
  '\uff1cDigisorption -3\uff1e',
  '\uff1cDigisorption\uff1e',
  '\uff1cDraw 1\uff1e',
  '\uff1cDraw 2\uff1e',
  '\uff1cDraw 3\uff1e',
  '\uff1cEvade\uff1e',
  '\uff1cExecute\uff1e',
  '\uff1cFragment (3)\uff1e',
  '\uff1cIceclad\uff1e',
  '\uff1cFortitude\uff1e',
  '\uff1cJamming\uff1e',
  '\uff1cLink +1\uff1e',
  '\uff1cMaterial Save 1\uff1e',
  '\uff1cMaterial Save 2\uff1e',
  '\uff1cMaterial Save 3\uff1e',
  '\uff1cMaterial Save 4\uff1e',
  '\uff1cMind Link\uff1e',
  '\uff1cOverclock ([Composite] trait)\uff1e',
  '\uff1cOverclock ([Puppet] trait)\uff1e',
  '\uff1cPartition (Blue Lv.4 + Green Lv.4)\uff1e',
  '\uff1cPartition (Black Lv.4 + Yellow Lv.4)\uff1e',
  '\uff1cPartition (Red Lv.4 + Yellow Lv.4)\uff1e',
  '\uff1cPartition (Yellow Lv.6 + Black Lv.6)\uff1e',
  '\uff1cPartition (Yellow/Black Lv.6 + Green/Purple Lv.6)\uff1e',
  '\uff1cPiercing\uff1e',
  '\uff1cProgress\uff1e',
  '\uff1cRaid\uff1e',
  '\uff1cReboot\uff1e',
  '\uff1cRecovery +1 (Deck)\uff1e',
  '\uff1cRecovery +2 (Deck)\uff1e',
  '\uff1cRetaliation\uff1e',
  '\uff1cRush\uff1e',
  '\uff1cSave\uff1e',
  '\uff1cSecurity A. +1\uff1e',
  '\uff1cSecurity A. +2\uff1e',
  '\uff1cSecurity A. -1\uff1e',
  '\uff1cSecurity A. -2\uff1e',
  '\uff1cSecurity A. -3\uff1e',
  '\uff1cTraining\uff1e',
  '\uff1cVortex\uff1e',
];

export const Colors: string[] = [
  'Yellow',
  'Green',
  'Red',
  'Purple',
  'White',
  'Black',
  'Silver',
];

export const RarityToColorMap: { [key: string]: string } = {
  COMMON: 'Yellow',
  UNCOMMON: 'Green',
  RARE: 'Red',
  HYPER: 'Purple',
  PURE: 'White',
  VOID: 'Black',
  SHATTERED: 'Silver',
};

export const Forms: string[] = [
  'In-Training',
  'Rookie',
  'Champion',
  'Ultimate',
  'Mega',
  'Hybrid',
  'Armor Form',
  'D-Reaper',
  'Appmon',
  'Stnd./Appmon',
  'Sup./Appmon',
  'Ult./Appmon',
  'God/Appmon',
];

export const Attributes: string[] = [
  'Data',
  'Vaccine',
  'Virus',
  'Free',
  'Variable',
  'Unknown',
  'NO DATA',
  'Entertainment',
  'Game',
  'God',
  'Life',
  'Navi',
  'Social',
  'System',
  'Tool',
];

export const Types: string[] = [
  '9000',
  'AA Defense Agent',
  'Abadin Electronics',
  'Ability Synthesis Agent',
  'Abnormal',
  'ACCEL',
  'Account Book (App Name)',
  'Action (App Name)',
  'Address Book (App Name)',
  'ADVENTURE',
  'Alien',
  'Alien Humanoid',
  'Amphibian',
  'Ancient',
  'Ancient Animal',
  'Ancient Aquabeast',
  'Ancient Bird',
  'Ancient Birdkin',
  'Ancient Crustacean',
  'Ancient Dragon',
  'Ancient Dragonkin',
  'Ancient Fairy',
  'Ancient Fish',
  'Ancient Holy Warrior',
  'Ancient Insectoid',
  'Ancient Mineral',
  'Ancient Mutant',
  'Ancient Mythical Beast',
  'Ancient Plant',
  'Angel',
  'Ankylosaur',
  'App Driver',
  'App Names',
  'Aquabeast',
  'Aquatic',
  'Archangel',
  'Armor',
  'Arousal (App Name)',
  'Astrology (App Name)',
  'Auction (App Name)',
  'Authority',
  'Avian',
  'Baby Dragon',
  'Backup (App Name)',
  'Bagra Army',
  'Base Defense Agent',
  'Battery (App Name)',
  'Battle (App Name)',
  'Beast',
  'Beast Dragon',
  'Beast Knight',
  'Beastkin',
  'Beauty (App Name)',
  'Big Death-Stars',
  'Bird',
  'Bird Dragon',
  'Birdkin',
  'Blue Flare',
  'Boss',
  'Brain Training (App Name)',
  'Broadcasting (App Name)',
  'Bulb',
  'Calculator (App Name)',
  'Calendar (App Name)',
  'Camera (App Name)',
  'Camouflage (App Name)',
  'Card (App Name)',
  'Carnivorous Plant',
  'Ceratopsian',
  'Cherub',
  'Chronicle',
  'Clock (App Name)',
  'Commander Agent',
  'Commentary (App Name)',
  'Communication (App Name)',
  'Compass (App Name)',
  'Composite',
  'Compression (App Name)',
  'Cook (App Name)',
  'Coordinate (App Name)',
  'Copy & Paste (App Name)',
  'Creation (App Name)',
  'CRT',
  'Crustacean',
  'Cyborg',
  'D-Brigade',
  'Dame Dame (App Name)',
  'Dark Animal',
  'Dark Dragon',
  'Dark Knight',
  'Dark Masters',
  'Decompression (App Name)',
  'Demon',
  'Demon God',
  'Demon Lord',
  'Design (App Name)',
  'Deva',
  'Device',
  'Diary (App Name)',
  'Dice (App Name)',
  'Dictionary (App Name)',
  'DigiPolice',
  'Dinosaur',
  'Doctor (App Name)',
  'Dominion',
  'Dragon',
  'Dragon Warrior',
  'Dragonkin',
  'Dream (App Name)',
  'DS',
  'Earth Dragon',
  'EBook (App Name)',
  'Effect (App Name)',
  'EMoney (App Name)',
  'Energy Saving (App Name)',
  'Enhancement',
  'Enhancement (App Name)',
  'Entertainment (App Name)',
  'Espionage Agent',
  'Evil',
  'Evil Dragon',
  'Failed (App Name)',
  'Fairy',
  'Fallen Angel',
  'Fashion (App Name)',
  'Fighting (App Name)',
  'Fire Dragon',
  'Flame',
  'Flick (App Name)',
  'Flight (App Name)',
  'Food',
  'Forced Termination (App Name)',
  'Fortune Telling (App Name)',
  'Four Great Dragons',
  'Four Sovereigns',
  'Galaxy',
  'Gashapon (App Name)',
  'General',
  'Ghost',
  'Giant Bird',
  'Global (App Name)',
  'God Beast',
  'Gossip (App Name)',
  'Gossip Review (App Name)',
  'Gourmet (App Name)',
  'GPS (App Name)',
  'Grappling Agent',
  'Ground Combat Agent',
  'Hacking (App Name)',
  'Hero',
  'Hints and Tips (App Name)',
  'Holy Beast',
  'Holy Bird',
  'Holy Dragon',
  'Holy Sword',
  'Holy Warrior',
  'Hotel (App Name)',
  'Hunter',
  'Ice-Snow',
  'Insectoid',
  'Intel Acquisition Agent',
  'Invader',
  'Invincible (App Name)',
  'Jamming (App Name)',
  'Larva',
  'LCD',
  'Legend-Arms',
  'Lesser',
  'LIBERATOR',
  'Library (App Name)',
  'Life (App Name)',
  'Light (App Name)',
  'Light Dragon',
  'Light Fang',
  'Login (App Name)',
  'Logoff (App Name)',
  'Machine',
  'Machine Dragon',
  'Magic Knight',
  'Magic Warrior',
  'Mail (App Name)',
  'Major',
  'Mammal',
  'Marine Man',
  'ME',
  'Media Player (App Name)',
  'Medical (App Name)',
  'Message (App Name)',
  'Mind Control (App Name)',
  'Mine',
  'Mineral',
  'Mini Angel',
  'Mini Bird',
  'Mini Dragon',
  'Minor',
  'Mirror (App Name)',
  'Mollusk',
  'Monitoring (App Name)',
  'Monk',
  'Mothership Agent',
  'Muscle Training (App Name)',
  'Music (App Name)',
  'Musical Instrument',
  'Mutant',
  'Mysterious Beast',
  'Mysterious Bird',
  'Mythical Beast',
  'Mythical Dragon',
  'Navi (App Name)',
  'News (App Name)',
  'Night Claw',
  'NO DATA',
  'NSo',
  'NSp',
  'Offline (App Name)',
  'Olympos XII',
  'Omnipotence (App Name)',
  'Online (App Name)',
  'Open (App Name)',
  'Paint (App Name)',
  'Parasite',
  'Perfect',
  'Phone (App Name)',
  'Plesiosaur',
  'Principality',
  'Pterosaur',
  'Puppet',
  'Puzzle (App Name)',
  'Race (App Name)',
  'Rare Animal',
  'Reboot (App Name)',
  'Reconnaissance Agent',
  'Recording (App Name)',
  'Reptile',
  'Reptile Man',
  'Rescue (App Name)',
  'Restoration (App Name)',
  'Review (App Name)',
  'Rhythm (App Name)',
  'Rock',
  'Rock Dragon',
  'Rocket (App Name)',
  'Role-playing game (App Name)',
  'Roulette (App Name)',
  'Royal Base',
  'Royal Knight',
  'Saving (App Name)',
  'Sea Animal',
  'Sea Beast',
  'Search (App Name)',
  'Security (App Name)',
  'SEEKERS',
  'Seraph',
  'Setup (App Name)',
  'Seven Great Demon Lords',
  'Shaman',
  'Shooting (App Name)',
  'Shopping (App Name)',
  'Simulation (App Name)',
  'Sky Dragon',
  'Sleep (App Name)',
  'Slot (App Name)',
  'SNS (App Name)',
  'SoC',
  'Spa (App Name)',
  'Stealth (App Name)',
  'Stegosaur',
  'Strategy (App Name)',
  'Subtypes',
  'Super Boot (App Name)',
  'Super Fortune Telling (App Name)',
  'Super Hacking (App Name)',
  'Super Major',
  'Super Search (App Name)',
  'Supple (App Name)',
  'Swipe (App Name)',
  'Tap (App Name)',
  'Tathāgata',
  'Ten Warriors',
  'Three Great Angels',
  'Three Musketeers',
  'Throne',
  'Time Slip (App Name)',
  'Training (App Name)',
  'Transfer (App Name)',
  'Translation (App Name)',
  'Transmission (App Name)',
  'Trashbin (App Name)',
  'Trick (App Name)',
  'Trip (App Name)',
  'Tropical Fish',
  'Tweet (App Name)',
  'Twilight',
  'Ultrasound (App Name)',
  'Unanalyzable',
  'Undead',
  'Unidentified',
  'Unique',
  'Unknown',
  'Variation (App Name)',
  'VB',
  'Vegetation',
  'Video (App Name)',
  'Virtue',
  'Virus (App Name)',
  'Voice Change (App Name)',
  'Vortex Warriors',
  'Wallpaper (App Name)',
  'Warning (App Name)',
  'Warrior',
  'Weapon',
  'Weather (App Name)',
  'WG',
  'Wicked God',
  'Witchelny',
  'Wizard',
  'X Antibody',
  'X Program',
  'Xros Heart',
  'Zip/Unzip (App Name)',
].sort();

export const Illustrators: string[] = [
  '61',
  "As'Maria",
  'Aurola',
  'Banira',
  'BIRU YAMAGUCHI',
  'Capitan Artiglio',
  'DAI-XT.',
  'E Volution',
  'Funbolt',
  'Gosha',
  'GOSSAN',
  'GS',
  'Hisashi Fujiwara',
  'Hokuyuu',
  'Hokyyuu',
  'Iori Sunakura',
  'Irasa',
  'Ishibashi Yosuke',
  'Itohiro',
  'Kagemaru Himeno',
  'Kariki Hakime',
  'Kayo Horaguchi',
  'K.Dra',
  'Kaz',
  'Kazumasa Yasukuni',
  'Keita Amemiya',
  'Kenji Watanabe',
  'Kirita',
  'KISUKE',
  'Koidetaku',
  'Koki',
  'Kuromori maya',
  'MATSUMOTO EIGHT',
  'MINAMINAMI Take',
  'Minato Sashima',
  'Mojuke',
  'Moyasi',
  'Murakami Hisashi',
  'NAKAMURA 8',
  'Nakano Haito',
  'NAKASHIMA YUUKI',
  'Naochika Morishita',
  'Naru',
  'NIJIMAARC',
  'Okada Anmitsu',
  'P!k@ru',
  'PLEX Fumiya Kobayashi',
  'Poroze',
  'Qacoro',
  'Robomisutya',
  'Ryodan',
  'Ryuda',
  'Sanosuke Sakuma',
  'Sasasi',
  'Satsuki may',
  'SENNSU',
  'Shigeo Niwa',
  'Shin Sasaki',
  'Shosuke',
  'Shoyama Seihou',
  'Soh Moriyama',
  'Souichirou Gunjima',
  'Spareribs',
  'Sunohara',
  'Takase',
  'Takeuchi Moto',
  'Takumi Kousaka',
  'TANIMESO',
  'TENYA YABUNO',
  'Teppei Tadokoro',
  'Tessy',
  'Tomotake Kinoshita',
  'Tonamikanji',
  'Toriyufu',
  'TSCR',
  'Tsunemi Aosa',
  'Tyuga',
  'UnnoDaisuke',
  'YAMURETSU',
  'Yuki Mukai',
  'Yuuki.',
].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export const SpecialRequirements: string[] = [
  'Digivolve',
  'DNA Digivolution',
  'DigiXros',
  'Burst Digivolve',
  'ACE',
  'App Fusion',
];

export const Restrictions: string[] = ['Banned', 'Restricted to 1'];

export const Presets: string[] = ['Ultimate Cup 2023', 'Ultimate Cup 2024'];

export const Blocks = ['00', '01', '02', '03', '04'];
export const BlockButtons: MultiButtons[] = [
  {
    name: '00',
    value: '00',
  },
  {
    name: '01',
    value: '01',
  },
  {
    name: '02',
    value: '02',
  },
  {
    name: '03',
    value: '03',
  },
  {
    name: '04',
    value: '04',
  },
  {
    name: '05',
    value: '05',
  },
];

export const CardTypes = ['Room', 'Item', 'Entity', 'Outcome'];
export const CardTypeButtons: MultiButtons[] = [
  {
    name: 'Room',
    value: 'Room',
  },
  {
    name: 'Item',
    value: 'Item',
  },
  {
    name: 'Entity',
    value: 'Entity',
  },
  {
    name: 'Outcome',
    value: 'Outcome',
  },
];

export const Rarity = ['C', 'U', 'R', 'SR', 'SEC', 'P'];
export const RarityButtons: MultiButtons[] = [
  {
    name: 'C',
    value: 'C',
  },
  {
    name: 'U',
    value: 'U',
  },
  {
    name: 'R',
    value: 'R',
  },
  {
    name: 'SR',
    value: 'SR',
  },
  {
    name: 'SEC',
    value: 'SEC',
  },
  {
    name: 'P',
    value: 'P',
  },
];

export const Versions = [
  'Normal',
  'Alternative Art',
  'Foil',
  'Textured',
  'Pre Release',
  'Box Topper',
  'Full Art',
  'Stamp',
  'Special Rare',
  'Rare Pull',
];
export const VersionButtons: MultiButtons[] = [
  {
    name: 'Normal',
    value: 'Normal',
  },
  {
    name: 'Alt. Art',
    value: 'Alternative Art',
  },
  {
    name: 'Foil',
    value: 'Foil',
  },
  {
    name: 'Textured',
    value: 'Textured',
  },
  {
    name: 'Pre-Rel.',
    value: 'Release',
  },
  {
    name: 'Box Topper',
    value: 'Box Topper',
  },
  {
    name: 'Full Art',
    value: 'Full Art',
  },
  {
    name: 'Stamp',
    value: 'Stamp',
  },
  {
    name: 'SP',
    value: 'Special Rare',
  },
  {
    name: 'RP',
    value: 'Rare Pull',
  },
];
