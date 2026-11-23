export {};

// ==========================================
// TELEGRAM INIT & EXPAND
// ==========================================
(function initTG() {
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  } catch(e) {}
})();

// ============================================================
// ROOT NAVIGATION FUNCTION
// ============================================================
function navTo(path) {
  const clean = path.startsWith('/') ? path : '/' + path;
  window.location.href = window.location.origin + clean;
}

const toastEl = document.getElementById('toastPill');
let toastTimer = null;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.innerText = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function launchGame(name, embedUrl) {
  if (!embedUrl) {
    showToast('Game not available');
    return;
  }
  window.location.href = `player.html?url=${encodeURIComponent(embedUrl)}&title=${encodeURIComponent(name)}&from=home`;
}

function openCategoryPage(categoryName) {
  const targetCat = categoryName || 'All';
  window.location.href = `games-category.html?cat=${encodeURIComponent(targetCat)}`;
}

// HERO DATA (10 GAMES)
const HERO = [
  {
    id: 'minecraft',
    name: 'Minecraft',
    genre: 'Adventure',
    sub: 'Sandbox · Build & Survive',
    title: 'MINECRAFT CLASSIC',
    desc: 'Explore endless voxel worlds, mine resources, craft tools, and build magnificent structures.',
    embed: 'https://nite.games/embed/minecraft',
    img: 'https://i.ibb.co/5XQp3hpr/99a001f682b808d041e91422df3fbae6.jpg'
  },
  {
    id: 'streetfighter2',
    name: 'Street Fighter II',
    genre: 'Fighting',
    sub: 'Arcade Legend · Tournament',
    title: 'STREET FIGHTER II',
    desc: 'Pick legendary martial artists like Ryu and Ken, execute iconic Hadoukens, and win the world title!',
    embed: 'https://nite.games/embed/street-fighter-2',
    img: 'https://i.ibb.co/XxvTJgpY/bf9d20a42abba19f4ff36407b8de15f8.jpg'
  },
  {
    id: 'mortalkombat',
    name: 'Mortal Kombat',
    genre: 'Fighting',
    sub: 'Brutal Arcade · Fatal Duel',
    title: 'ULTIMATE MORTAL KOMBAT 3',
    desc: 'Enter the brutal tournament, chain bone-breaking combos, and execute legendary finishing moves!',
    embed: 'https://nite.games/embed/ultimate-mortal-kombat-3',
    img: 'https://i.ibb.co/LDvS9wR0/5b79848516455ab8b246e93e9b51572d.jpg'
  },
  {
    id: 'streetfighteralpha',
    name: 'Street Fighter Alpha 3',
    genre: 'Fighting',
    sub: 'Custom Combos · Master Clash',
    title: 'STREET FIGHTER ALPHA 3',
    desc: 'Master the next generation of arcade combat with devastating custom combos and multi-tier supers!',
    embed: 'https://nite.games/embed/street-fighter-alpha-3',
    img: 'https://i.ibb.co/Jw0W5NTR/7e4f5dc8d273d6536bab152def9b2150.jpg'
  },
  {
    id: 'amongus',
    name: 'Among Us',
    genre: 'Strategy',
    sub: 'Sci-Fi · Impostor Hunt',
    title: 'AMONG US: CREWMATE',
    desc: 'Work together to complete starship tasks, but beware—an alien impostor is sabotaging the crew!',
    embed: 'https://nite.games/embed/among-us',
    img: 'https://i.ibb.co/Z6bXfQsW/6b01708ad1e5140d30e477469664a7c4.jpg'
  },
  {
    id: 'candycrush',
    name: 'Candy Crush',
    genre: 'Puzzle',
    sub: 'Match-3 · Sugar Kingdom',
    title: 'CANDY CRUSH SAGA',
    desc: 'Switch, match, and crush delicious candies through thousands of sugar-coated puzzle levels!',
    embed: 'https://nite.games/embed/candy-crush',
    img: 'https://i.ibb.co/sL21MG6/14ed501f0bdcc8a43ac468077a0b6baf.jpg'
  },
  {
    id: 'backrooms',
    name: 'The Backrooms',
    genre: 'Horror',
    sub: 'Liminal Maze · Psychological',
    title: 'THE BACKROOMS: ESCAPE',
    desc: 'Noclip through infinite yellow rooms and humming lights. Avoid hostile entities and escape.',
    embed: 'https://nite.games/embed/backrooms',
    img: 'https://i.ibb.co/q3Px6B1J/b0d359f4b2a013f165a32f3fb46cf4d2.jpg'
  },
  {
    id: 'squidgame',
    name: 'Squid Game',
    genre: 'Survival',
    sub: 'High Stakes · Survival Trial',
    title: 'SQUID GAME: ARENA',
    desc: 'Survive intense childhood playground games including Red Light Green Light to win the mega prize!',
    embed: 'https://nite.games/embed/squid-game',
    img: 'https://i.ibb.co/Pv3ZRKsg/b040ac55b22a3d760f10a5cf5c2e6977.jpg'
  },
  {
    id: 'gtaadvanced',
    name: 'GTA Advanced',
    genre: 'Action',
    sub: 'Underworld · Vice Heist',
    title: 'GRAND THEFT AUTO',
    desc: 'Rule the streets of Liberty City with high-speed police getaways, turf wars, and mafia missions.',
    embed: 'https://nite.games/embed/gta-advanced',
    img: 'https://i.ibb.co/Vc051Yxn/fe58d98fa9860b0c9dd861359ce7d3e5.jpg'
  },
  {
    id: 'subwaysurfers',
    name: 'Subway Surfers',
    genre: 'Runner',
    sub: 'Endless Run · Metro Dash',
    title: 'SUBWAY SURFERS: WORLD',
    desc: 'Dash along the train tracks, grind power lines, and escape the grumpy Inspector and his dog!',
    embed: 'https://nite.games/embed/subway-surfers',
    img: 'https://i.ibb.co/LKHMqbc/c300376a4f872ef35cc51db6736e4d95.jpg'
  }
];

const heroWrap = document.getElementById('heroWrap');
const HN = HERO.length;
const heroSlides = [];
let heroIndex = 0;
let heroBusy = false;
let heroTimer = null;

HERO.forEach((h, i) => {
  const slide = document.createElement('section');
  slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
  slide.innerHTML =
    '<div class="hero-bg-media" style="background-image:url(\'' + h.img + '\');"></div>' +
    '<div class="hero-overlay"></div>' +
    '<div class="hero-info">' +
      '<div class="hero-subtitle-line"><span>' + h.sub + '</span></div>' +
      '<h2>' + h.title + '</h2>' +
      '<p>' + h.desc + '</p>' +
      '<button class="hero-play" onclick="launchGame(\'' + h.name.replace(/'/g, "\\'") + '\', \'' + h.embed + '\')">Play now</button>' +
    '</div>';
  heroWrap.appendChild(slide);
  heroSlides.push(slide);
});

heroWrap.insertAdjacentHTML('beforeend',
  '<div class="hero-rail-wrap"><div class="hero-rail" id="heroRail"></div></div>' +
  '<div class="hero-ctrl">' +
    '<div class="hero-ctrl-left">' +
      '<button class="hero-arrow" id="hPrev" aria-label="Previous Slide">' +
        '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
      '</button>' +
      '<button class="hero-arrow" id="hNext" aria-label="Next Slide">' +
        '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
      '</button>' +
    '</div>' +
    '<div class="hero-counter" id="heroCount">01</div>' +
  '</div>'
);

const heroRail = document.getElementById('heroRail');
const heroCount = document.getElementById('heroCount');

function renderRail(animate) {
  let s = '';
  for (let k = 1; k < HN; k++) {
    const idx = (heroIndex + k) % HN;
    const h = HERO[idx];
    s += '<div class="hero-thumb" data-i="' + idx + '" onclick="launchGame(\'' + h.name.replace(/'/g, "\\'") + '\', \'' + h.embed + '\')">' +
      '<div class="hero-thumb-bg" style="background-image:url(\'' + h.img + '\');"></div>' +
      '<div class="hero-thumb-overlay"></div>' +
      '<div class="hero-thumb-meta">' +
        '<span>' + h.genre + '</span>' +
        '<b>' + h.name + '</b>' +
      '</div>' +
    '</div>';
  }
  heroRail.innerHTML = s;
  heroRail.classList.remove('in');
  if (animate) {
    void heroRail.offsetWidth;
    heroRail.classList.add('in');
  }
}

function scheduleHero() {
  clearTimeout(heroTimer);
  heroTimer = setTimeout(() => goHero(heroIndex + 1), 3500);
}

function goHero(n) {
  n = (n + HN) % HN;
  if (n === heroIndex || heroBusy) return;
  heroBusy = true;

  const from = heroSlides[heroIndex];
  const to = heroSlides[n];
  const card = heroRail.querySelector('[data-i="' + n + '"]');
  const wr = heroWrap.getBoundingClientRect();

  let t = wr.height * 0.45, r = 20, b = 90, l = wr.width * 0.55;
  if (card) {
    const cr = card.getBoundingClientRect();
    t = cr.top - wr.top;
    l = cr.left - wr.left;
    r = wr.right - cr.right;
    b = wr.bottom - cr.bottom;
  }

  to.classList.add('active');
  from.classList.remove('active');
  from.classList.add('prev');

  const anim = to.animate(
    [
      { clipPath: 'inset(' + t + 'px ' + r + 'px ' + b + 'px ' + l + 'px round 20px)' },
      { clipPath: 'inset(0px 0px 0px 0px round 0px)' }
    ],
    { duration: 420, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }
  );

  heroIndex = n;
  heroCount.textContent = String(n + 1).padStart(2, '0');
  renderRail(true);
  scheduleHero();

  anim.onfinish = () => {
    from.classList.remove('prev');
    heroBusy = false;
  };
}

document.getElementById('hPrev').onclick = (e) => { e.stopPropagation(); goHero(heroIndex - 1); };
document.getElementById('hNext').onclick = (e) => { e.stopPropagation(); goHero(heroIndex + 1); };

let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
heroWrap.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}, { passive: true });

heroWrap.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const dt = Date.now() - touchStartTime;
  if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2 && dt < 450) {
    goHero(heroIndex + (dx < 0 ? 1 : -1));
  }
}, { passive: true });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearTimeout(heroTimer);
  } else {
    scheduleHero();
  }
});

renderRail(false);
scheduleHero();

// ============================================================
// CONTENT SECTIONS
// ============================================================
const CHEVRON = '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';
function sectionHead(title: string, right?: string, clickAction?: string) {
  const act = clickAction ? ' onclick="' + clickAction + '" style="cursor:pointer;"' : '';
  return '<div class="sec-head"' + act + '><div class="sec-title"><span>' + title + '</span>' + CHEVRON + '</div>' + (right || '') + '</div>';
}

let html = '';

// 1. TRENDING NOW
const TREND = [
  { id: 'templerun2',    name: 'Temple Run 2',    genre: 'Runner',         embed: 'https://nite.games/embed/temple-run-2-spooky-summit', img: 'https://i.ibb.co/Z65t466g/b594ba9e22761159083dbd4b0f1b7c70.jpg' },
  { id: 'bloxdio',       name: 'Bloxd.io',        genre: 'Multiplayer',    embed: 'https://nite.games/embed/bloxd-io',                  img: 'https://i.ibb.co/mCTQmNkh/file-00000000fe94820aa9ba6f81af6d4ebb.png' },
  { id: 'granny',        name: 'Granny',          genre: 'Horror',         embed: 'https://nite.games/embed/granny',                    img: 'https://i.ibb.co/HTYMbqd3/file-0000000080ac820ab14005f337c73680.png' },
  { id: 'superhot',      name: 'Superhot',        genre: 'Action',         embed: 'https://nite.games/embed/super-hot',                 img: 'https://i.ibb.co/nqRvTNyW/file-00000000d25482108a8ef86d3ba8049c.png' },
  { id: 'hollowknight',  name: 'Hollow Knight',   genre: 'Adventure',      embed: 'https://nite.games/embed/hollow-knight',             img: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg' },
  { id: 'perfectslices', name: 'Perfect Slices',  genre: 'Casual',         embed: 'https://nite.games/embed/perfect-slices',            img: 'https://i.ibb.co/PZ7PxmP5/file-000000008ab8820aa93724ab87d5df84.png' },
  { id: 'pacman',        name: 'Pacman',          genre: 'Classic Arcade', embed: 'https://nite.games/embed/pacman',                    img: 'https://i.ibb.co/B216Z2tP/bbff44b6522ec1aad784746784281a7a.jpg' },
  { id: 'fruitninja',    name: 'Fruit Ninja',     genre: 'Arcade',         embed: 'https://nite.games/embed/fruit-ninja',               img: 'https://i.ibb.co/wZF4s9L3/1773cda0498093147a67ac5ed6ba2d68.jpg' },
  { id: 'supermario64',  name: 'Super Mario 64',  genre: 'Platformer',     embed: 'https://nite.games/embed/super-mario-64',            img: 'https://i.ibb.co/8LB1b9nW/a67247511d2d7cc1276b3b6ce0bdce66.jpg' }
];

html += '<div class="section" style="padding-top:24px;">' + sectionHead('Trending Now', '<span class="sec-sub">Top 9 Today</span>') + '<div class="h-scroll" style="gap:10px;">';
TREND.forEach((item, i) => {
  html += '<div class="rank-item" onclick="launchGame(\'' + item.name.replace(/'/g, "\\'") + '\', \'' + item.embed + '\')">' +
    '<div class="rank-num">' + (i + 1) + '</div>' +
    '<div class="rank-poster" style="background-image:url(\'' + item.img + '\');">' +
      '<div class="poster-meta"><span class="poster-name">' + item.name + '</span><span class="poster-genre">' + item.genre + '</span></div>' +
    '</div></div>';
});
html += '</div></div>';

// 2. VIEW ALL GAMES
const VIEW_ALL_CATEGORIES = [
  {
    name: 'Racing games',
    catKey: 'Racing',
    count: '8 games',
    c1: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=350&q=80',
    c2: 'https://i.ibb.co/Vc051Yxn/fe58d98fa9860b0c9dd861359ce7d3e5.jpg',
    c3: 'https://i.ibb.co/wZF4s9L3/1773cda0498093147a67ac5ed6ba2d68.jpg'
  },
  {
    name: 'Endless games',
    catKey: 'Endless',
    count: '14 games',
    c1: 'https://i.ibb.co/Z65t466g/b594ba9e22761159083dbd4b0f1b7c70.jpg',
    c2: 'https://i.ibb.co/B216Z2tP/bbff44b6522ec1aad784746784281a7a.jpg',
    c3: 'https://i.ibb.co/LKHMqbc/c300376a4f872ef35cc51db6736e4d95.jpg'
  },
  {
    name: 'Puzzle',
    catKey: 'Puzzle',
    count: '26 games',
    c1: 'https://i.ibb.co/mCTQmNkh/file-00000000fe94820aa9ba6f81af6d4ebb.png',
    c2: 'https://i.ibb.co/PZ7PxmP5/file-000000008ab8820aa93724ab87d5df84.png',
    c3: 'https://i.ibb.co/sL21MG6/14ed501f0bdcc8a43ac468077a0b6baf.jpg'
  },
  {
    name: 'Board games',
    catKey: 'Board',
    count: '12 games',
    c1: 'https://i.ibb.co/8LB1b9nW/a67247511d2d7cc1276b3b6ce0bdce66.jpg',
    c2: 'https://i.ibb.co/LDvS9wR0/5b79848516455ab8b246e93e9b51572d.jpg',
    c3: 'https://i.ibb.co/5XQp3hpr/99a001f682b808d041e91422df3fbae6.jpg'
  }
];

html += '<div class="section">' + sectionHead('View all games', '<span class="see-all" onclick="openCategoryPage(\'All\')">See All</span>', 'openCategoryPage(\'All\')') + '<div class="deck-grid">';
VIEW_ALL_CATEGORIES.forEach(d => {
  html += '<div class="deck-box" onclick="openCategoryPage(\'' + d.catKey + '\')">' +
    '<div class="deck-stage">' +
      '<div class="deck-fan">' +
        '<div class="deck-card c-left" style="background-image:url(\'' + d.c1 + '\');"></div>' +
        '<div class="deck-card c-right" style="background-image:url(\'' + d.c2 + '\');"></div>' +
        '<div class="deck-card c-mid" style="background-image:url(\'' + d.c3 + '\');"></div>' +
      '</div>' +
      '<div class="deck-pocket">' +
        '<div class="bolt tl"></div><div class="bolt tr"></div>' +
        '<div class="bolt bl"></div><div class="bolt br"></div>' +
      '</div>' +
    '</div>' +
    '<div class="deck-label">' + d.name + ' <span class="sub">· ' + d.count + '</span></div>' +
  '</div>';
});
html += '</div></div>';

// 3. MOST PLAYED
const MOST_PLAYED_ITEMS = [
  {
    id: 'driveforspeed',
    name: 'Drive for Speed: Simulator',
    genre: 'Racing',
    embed: 'https://www.madkidgames.com/full/drive-for-speed-simulator',
    cover: 'https://www.madkidgames.com/games/drive-for-speed-simulator/thumb_2.jpg'
  },
  {
    id: 'shadowfight2',
    name: 'Shadow Fight 2',
    genre: 'Fighting / Action',
    embed: 'https://www.madkidgames.com/full/shadow-fight-2',
    cover: 'https://www.madkidgames.com/games/shadow-fight-2/thumb_2.jpg'
  },
  {
    id: 'angrybirds2',
    name: 'Angry Birds 2',
    genre: 'Arcade / Physics',
    embed: 'https://www.madkidgames.com/full/angry-birds-2',
    cover: 'https://www.madkidgames.com/games/angry-birds-2/thumb_2.jpg'
  },
  {
    id: 'vector2',
    name: 'Vector 2',
    genre: 'Parkour / Runner',
    embed: 'https://www.madkidgames.com/full/vector-2',
    cover: 'https://www.madkidgames.com/games/vector-2/thumb_2.jpg'
  },
  {
    id: 'mrmeat',
    name: 'Mr. Meat: Horror Escape',
    genre: 'Horror / Puzzle',
    embed: 'https://www.madkidgames.com/full/mr-meat-horror-escape-room',
    cover: 'https://www.madkidgames.com/games/mr-meat-horror-escape-room/thumb_2.jpg'
  },
  {
    id: 'altosadventure',
    name: "Alto's Adventure",
    genre: 'Endless Runner',
    embed: 'https://www.madkidgames.com/full/altos-adventure',
    cover: 'https://www.madkidgames.com/games/altos-adventure/thumb_2.jpg'
  },
  {
    id: 'fnaf',
    name: "Five Nights at Freddy's",
    genre: 'Survival Horror',
    embed: 'https://www.madkidgames.com/full/five-nights-at-freddys',
    cover: 'https://www.madkidgames.com/games/five-nights-at-freddys/thumb_2.jpg'
  },
  {
    id: 'assassinscreed',
    name: "Assassin's Creed Identity",
    genre: 'Action / Stealth',
    embed: 'https://www.madkidgames.com/full/assassins-credit-identify',
    cover: 'https://www.madkidgames.com/games/assassins-credit-identify/thumb_2.jpg'
  },
  {
    id: 'dragonhills2',
    name: 'Dragon Hills 2',
    genre: 'Action Adventure',
    embed: 'https://www.madkidgames.com/full/dragon-hills',
    cover: 'https://www.madkidgames.com/games/dragon-hills/thumb_2.jpg'
  },
  {
    id: 'badpiggies',
    name: 'Bad Piggies',
    genre: 'Puzzle / Building',
    embed: 'https://www.madkidgames.com/full/bad-piggies',
    cover: 'https://www.madkidgames.com/games/bad-piggies/thumb_2.jpg'
  }
];

const WREATH_SVG = '<svg class="wreath" viewBox="0 0 36 36">' +
  '<path d="M10 26 C8 21 8 15 12 10 M8 23 C6 22 6 20 8 19 M7 19 C5 18 5 16 7 15 M8 15 C6 14 7 12 9 12 M10 12 C8 10 10 8 12 9" fill="none" stroke="#031412" stroke-width="1.8" stroke-linecap="round"/>' +
  '<path d="M26 26 C28 21 28 15 24 10 M28 23 C30 22 30 20 28 19 M29 19 C31 18 31 16 29 15 M28 15 C30 14 29 12 27 12 M26 12 C28 10 26 8 24 9" fill="none" stroke="#031412" stroke-width="1.8" stroke-linecap="round"/>' +
'</svg>';

html += '<div class="section">' + sectionHead('Most Played', '<span class="sec-sub">Top 10</span>') + '<div class="mp-rank-scroll">';

// COLUMN 1: RANKS 1 TO 5
html += '<div class="mp-rank-column">';
MOST_PLAYED_ITEMS.slice(0, 5).forEach((m, idx) => {
  const rank = idx + 1;
  const isTop3 = rank <= 3;
  html += '<div class="mp-item-row" onclick="launchGame(\'' + m.name.replace(/'/g, "\\'") + '\', \'' + m.embed + '\')">' +
    '<div class="mp-badge-box ' + (isTop3 ? 'top-three' : 'other-ranks') + '">' +
      (isTop3 ? WREATH_SVG : '') +
      '<span>' + rank + '</span>' +
    '</div>' +
    '<div class="mp-thumb-cover" style="background-image:url(\'' + m.cover + '\');"></div>' +
    '<div class="mp-meta-info">' +
      '<div class="mp-game-title">' + m.name + '</div>' +
      '<div class="mp-game-genre">' + m.genre + '</div>' +
    '</div>' +
  '</div>';
});
html += '</div>';

// COLUMN 2: RANKS 6 TO 10
html += '<div class="mp-rank-column">';
MOST_PLAYED_ITEMS.slice(5, 10).forEach((m, idx) => {
  const rank = idx + 6;
  html += '<div class="mp-item-row" onclick="launchGame(\'' + m.name.replace(/'/g, "\\'") + '\', \'' + m.embed + '\')">' +
    '<div class="mp-badge-box other-ranks">' +
      '<span>' + rank + '</span>' +
    '</div>' +
    '<div class="mp-thumb-cover" style="background-image:url(\'' + m.cover + '\');"></div>' +
    '<div class="mp-meta-info">' +
      '<div class="mp-game-title">' + m.name + '</div>' +
      '<div class="mp-game-genre">' + m.genre + '</div>' +
    '</div>' +
  '</div>';
});
html += '</div>';

html += '</div></div>';

// 4. QUICK PLAY
const QUICK_GAMES = [
  {
    id: 'slope',
    name: 'Slope 3D',
    genre: 'High-Speed Reflex',
    r: '4.9',
    embed: 'https://nite.games/embed/slope',
    logo: 'https://play-lh.googleusercontent.com/Ev5gkPTONr-1k1r7erT0iiW-pUZoGUH_6FVQdD91e9ghSAqZRMTaFVGQW5Z6PLOfFgxZnJhdEBE2z-TgfZ1bsg=w240-h240-rw'
  },
  {
    id: 'motox3m',
    name: 'Moto X3M',
    genre: 'Extreme Bike Stunts',
    r: '4.8',
    embed: 'https://nite.games/embed/moto-x3m',
    logo: 'https://play-lh.googleusercontent.com/_S9XtyzKJmaT9XN5Mo37kRefwSA4KU-8K4PXBubCqNY3KZvkm_UqcKCuOPFPQSMp6hlGUJnxbamNraYQrZffdA=w240-h240-rw'
  },
  {
    id: 'geometrydash',
    name: 'Geometry Dash',
    genre: 'Rhythm Platformer',
    r: '4.9',
    embed: 'https://nite.games/embed/geometry-dash',
    logo: 'https://cdn.iconscout.com/icon/free/png-256/free-geometry-dash-icon-svg-download-png-10673458.png?f=webp'
  },
  {
    id: 'stickmanhook',
    name: 'Stickman Hook',
    genre: 'Swing Physics',
    r: '4.7',
    embed: 'https://nite.games/embed/stickman-hook',
    logo: 'https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=204,height=204,fit=cover,f=auto/99e090d154caf30f3625df7e456d5984/stickman-hook-logo.png'
  },
  {
    id: 'crossyroad',
    name: 'Crossy Road',
    genre: 'Endless Hopper',
    r: '4.8',
    embed: 'https://nite.games/embed/crossy-road',
    logo: 'https://img.utdstc.com/icon/827/346/827346533e6a84431836c86483316a15942031a4b5c699fe21fea8a3b86d194b:200'
  }
];

html += '<div class="section">' + sectionHead('Quick Play', '<span class="sec-sub">Under 2 min</span>') + '<div class="list-card">';
QUICK_GAMES.forEach(g => {
  html += '<div class="list-row" onclick="launchGame(\'' + g.name.replace(/'/g, "\\'") + '\', \'' + g.embed + '\')">' +
    '<div class="qp-logo" style="background-image:url(\'' + g.logo + '\');"></div>' +
    '<div class="list-txt"><span class="list-name">' + g.name + '</span><span class="list-meta"><b>★ ' + g.r + '</b><span>•</span><span>' + g.genre + '</span></span></div>' +
    '<button class="list-play" onclick="event.stopPropagation();launchGame(\'' + g.name.replace(/'/g, "\\'") + '\', \'' + g.embed + '\')">Play</button></div>';
});
html += '</div></div>';

// 5. NEW RELEASES
const NEW_RELEASES_LIST = [
  {
    id: 'halflife',
    name: 'Half-Life',
    sub: 'Valve · Sci-Fi Classic',
    players: '3.8k players',
    embed: 'https://nite.games/embed/half-life',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg'
  },
  {
    id: 'ultrakill',
    name: 'ULTRAKILL',
    sub: 'New Blood · Fast-Paced FPS',
    players: '4.5k players',
    embed: 'https://nite.games/embed/ultrakill',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/1229490/header.jpg'
  },
  {
    id: 'myfriendpedro',
    name: 'My Friend Pedro',
    sub: 'DeadToast · Bullet-Time Gunplay',
    players: '2.9k players',
    embed: 'https://nite.games/embed/my-friend-pedro',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/557340/header.jpg'
  },
  {
    id: 'quake',
    name: 'QUAKE',
    sub: 'id Software · Dark Fantasy FPS',
    players: '2.1k players',
    embed: 'https://nite.games/embed/quake',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/2310/header.jpg'
  },
  {
    id: 'wolfenstein3d',
    name: 'Wolfenstein 3D',
    sub: 'id Software · Retro Legend',
    players: '1.7k players',
    embed: 'https://nite.games/embed/wolfenstein-3d',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/2270/header.jpg'
  },
  {
    id: 'raft',
    name: 'Raft: Ocean Nomad',
    sub: 'Redbeet · Survival Odyssey',
    players: '3.2k players',
    embed: 'https://nite.games/embed/raft',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/648800/header.jpg'
  },
  {
    id: 'happywheels',
    name: 'Happy Wheels',
    sub: 'Fancy Force · Ragdoll Physics',
    players: '5.4k players',
    embed: 'https://nite.games/embed/happy-wheels',
    banner: 'https://play-lh.googleusercontent.com/4v0W8T518-h4Uzc5l3c-QbqMW3CTvEG7EAPPoiPmtANJu_0LBdyCmaIEVAVVaJwK9-5y7glQPh7jIaiQ-QUzvQ=w526-h296-rw'
  },
  {
    id: 'dukenukem3d',
    name: 'Duke Nukem 3D',
    sub: '3D Realms · Iconic Action',
    players: '2.4k players',
    embed: 'https://nite.games/embed/duke-nukem-3d',
    banner: 'https://cdn.akamai.steamstatic.com/steam/apps/434050/header.jpg'
  }
];

html += '<div class="section">' + sectionHead('New Releases') + '<div class="nr-grid">';
NEW_RELEASES_LIST.forEach(n => {
  html += '<div class="nr-card" onclick="launchGame(\'' + n.name.replace(/'/g, "\\'") + '\', \'' + n.embed + '\')">' +
    '<div class="nr-banner" style="background-image:url(\'' + n.banner + '\');">' +
      '<div class="nr-banner-overlay"></div>' +
    '</div>' +
    '<div class="nr-content">' +
      '<div class="nr-title">' + n.name + '</div>' +
      '<div class="nr-desc">' +
        '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>' +
        '<span>' + n.sub + '</span>' +
      '</div>' +
      '<div class="nr-bottom">' +
        '<div class="nr-social">' +
          '<div class="nr-avatars">' +
            '<div class="nr-avatar" style="background:#2dd4bf;"></div>' +
            '<div class="nr-avatar" style="background:#f43f5e;"></div>' +
            '<div class="nr-avatar" style="background:#fbbf24;"></div>' +
          '</div>' +
          '<div class="nr-count">' + n.players + '</div>' +
        '</div>' +
        '<button class="nr-play-btn" onclick="event.stopPropagation();launchGame(\'' + n.name.replace(/'/g, "\\'") + '\', \'' + n.embed + '\')">Play</button>' +
      '</div>' +
    '</div>' +
  '</div>';
});
html += '</div></div>';

document.getElementById('sections').innerHTML = html;

Object.assign(window, { navTo, showToast, launchGame, openCategoryPage, renderRail, scheduleHero, goHero, sectionHead });
