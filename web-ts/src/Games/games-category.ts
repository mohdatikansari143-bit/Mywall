export {};

// HARDWARE / SCREEN BACK: REPLACE LOCATION TO PREVENT LOOPS
function handleBackAction() {
  window.location.replace('Games.html');
}

// MOBILE PHYSICAL BACK BUTTON LISTENER (NO REPEATS)
history.pushState({ page: 'category' }, '');
window.addEventListener('popstate', function(e) {
  window.location.replace('Games.html');
});

const TARGET_GAMES = 500;
const CACHE_KEY = 'games_cat_500_unique_v3';
let GAMES = [];

const qParams = new URLSearchParams(window.location.search);
let currentCat = qParams.get('cat') || "All";

function normalizeCategories(raw) {
  const arr = Array.isArray(raw)
    ? raw
    : String(raw || 'Casual').split(',').map(s => s.trim()).filter(Boolean);
  const out = [];
  const add = c => { if (c && !out.includes(c)) out.push(c); };

  arr.forEach(tag => {
    const t = String(tag).trim();
    const l = t.toLowerCase();
    if (!l || l === 'embeddable' || l === 'free' || l === 'html5' || l === 'unity' || l === 'mobile' || l === '1 player' || l === '2d' || l === '3d') return;
    if (l.includes('shoot') || l.includes('sniper') || l === 'fps' || l.includes('gun')) add('Shooter');
    else if (l.includes('stick')) add('Stick man');
    else if (l.includes('fight') || l.includes('combat') || l.includes('box') || l.includes('duel') || l.includes('brawl')) add('Fighting');
    else if (l.includes('board') || l.includes('chess') || l.includes('card') || l.includes('solitaire') || l.includes('mahjong') || l.includes('ludo') || l.includes('domino') || l.includes('checker')) add('Board');
    else if (l.includes('endless') || l.includes('runner') || l.includes('flappy')) add('Endless');
    else if (l.includes('rac') || l.includes('car') || l.includes('driv') || l.includes('drift') || l.includes('bike') || l.includes('moto') || l.includes('kart')) add('Racing');
    else if (l.includes('sport') || l.includes('soccer') || l.includes('football') || l.includes('basket') || l.includes('tennis') || l.includes('golf') || l.includes('pool')) add('Sports');
    else if (l.includes('surviv') || l.includes('zombie') || l.includes('horror') || l.includes('escape')) add('Survival');
    else if (l.includes('puzzl') || l.includes('brain') || l.includes('logic') || l.includes('match') || l.includes('word') || l.includes('color')) add('Puzzle');
    else if (l.includes('strateg') || l.includes('defense') || l.includes('tycoon') || l.includes('simulat') || l.includes('rpg')) add('Strategy');
    else if (l.includes('casual') || l.includes('arcade') || l.includes('clicker') || l.includes('idle') || l.includes('fun')) add('Casual');
    else add(t);
  });

  if (!out.length) out.push('Casual');
  return out.join(',');
}

function fetchJsonText(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => {
      if (ctrl) ctrl.abort();
      reject(new Error('Timeout'));
    }, timeoutMs);
    fetch(url, { mode: 'cors', signal: ctrl ? ctrl.signal : undefined, headers: { 'Accept': 'application/json, text/plain, */*' } })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(text => {
        clearTimeout(timer);
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.contents === 'string') {
          resolve(JSON.parse(parsed.contents));
        } else {
          resolve(parsed);
        }
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

let jsonpCounter = 0;
function fetchJsonpAllOrigins(url, timeoutMs = 9000) {
  return new Promise((resolve, reject) => {
    const cbName = '__gcat_cb_' + (++jsonpCounter) + '_' + Date.now();
    const script = document.createElement('script');
    let settled = false;

    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete window[cbName]; } catch (e) { window[cbName] = undefined; }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('JSONP timeout'));
    }, timeoutMs);

    window[cbName] = function(data) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      try {
        if (data && typeof data.contents === 'string') {
          resolve(JSON.parse(data.contents));
        } else if (data && typeof data === 'object') {
          resolve(data);
        } else {
          reject(new Error('Empty JSONP'));
        }
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = function() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      reject(new Error('JSONP error'));
    };

    script.src = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&callback=${cbName}`;
    (document.head || document.body || document.documentElement).appendChild(script);
  });
}

function raceFirstSuccess(factories: Array<() => Promise<any>>): Promise<any> {
  return new Promise((resolve, reject) => {
    let remaining = factories.length;
    let done = false;
    if (!remaining) return reject(new Error('No sources'));
    factories.forEach(fn => {
      Promise.resolve().then(fn).then((val: any) => {
        if (!done && val && (Array.isArray(val) ? val.length > 0 : typeof val === 'object')) {
          done = true;
          resolve(val);
        } else {
          remaining--;
          if (remaining === 0 && !done) reject(new Error('All failed'));
        }
      }).catch(() => {
        remaining--;
        if (remaining === 0 && !done) reject(new Error('All failed'));
      });
    });
  });
}

async function fetchJsonFast(url: string): Promise<any> {
  try {
    return await raceFirstSuccess([
      () => fetchJsonText(url, 6000),
      () => fetchJsonText(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, 9000),
      () => fetchJsonText(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, 9000),
      () => fetchJsonText(`https://corsproxy.io/?url=${encodeURIComponent(url)}`, 7500),
      () => fetchJsonpAllOrigins(url, 9500)
    ]);
  } catch (e) {
    return null;
  }
}

function cleanUrl(u, base = '') {
  if (!u || typeof u !== 'string') return '';
  let s = u.trim();
  if (s.startsWith('//')) return 'https:' + s;
  if (s.startsWith('/') && base) return base.replace(/\/+$/, '') + s;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (base && !s.includes('://') && /\.(webp|png|jpg|jpeg|gif)$/i.test(s)) {
    return base.replace(/\/+$/, '') + '/' + s.replace(/^\/+/, '');
  }
  return '';
}

async function loadOnlineGames() {
  const json = await fetchJsonFast('https://www.onlinegames.io/media/plugins/genGames/embed.json');
  if (!Array.isArray(json)) return [];
  return json
    .filter(g => g && g.title && cleanUrl(g.image) && cleanUrl(g.embed))
    .map(g => [String(g.title).trim(), normalizeCategories(g.tags), cleanUrl(g.image), cleanUrl(g.embed)]);
}

async function loadPlayKovo() {
  const json = await fetchJsonFast('https://playkovo.com/api/embed-games?format=json');
  const list = Array.isArray(json) ? json : (json && Array.isArray(json.games) ? json.games : []);
  return list
    .filter(g => g && g.title && cleanUrl(g.thumbnailUrl || g.thumbnail) && cleanUrl(g.embedUrl))
    .map(g => [String(g.title).trim(), normalizeCategories(g.categories), cleanUrl(g.thumbnailUrl || g.thumbnail), cleanUrl(g.embedUrl)]);
}

async function loadNiteGames() {
  const json = await fetchJsonFast('https://nite.games/api/games');
  const list = Array.isArray(json) ? json : (json && (json.games || json.data || json.items) || []);
  return list
    .map(g => {
      if (!g) return null;
      const title = String(g.title || g.name || '').trim();
      const slug = g.slug ? String(g.slug).trim() : '';
      const embed = cleanUrl(g.embedUrl || g.embed, 'https://nite.games') || (slug ? `https://nite.games/embed/${slug}` : '');
      const rawImg = g.icon || g.image || g.thumbnail || g.cover || g.thumb || (slug ? `/${slug}.webp` : '');
      const img = cleanUrl(rawImg, 'https://nite.games');
      if (!title || !img || !embed) return null;
      return [title, normalizeCategories(g.genres || g.categories || g.category || g.genre || g.tags), img, embed];
    })
    .filter(Boolean);
}

async function loadGamePix() {
  const reqs = [
    fetchJsonFast('https://games.gamepix.com/games?sid=1&order=q&limit=500&offset=0'),
    fetchJsonFast('https://feeds.gamepix.com/v2/json?sid=1&pagination=96&page=1'),
    fetchJsonFast('https://feeds.gamepix.com/v2/json?sid=1&pagination=96&page=2'),
    fetchJsonFast('https://feeds.gamepix.com/v2/json?sid=1&pagination=96&page=3'),
    fetchJsonFast('https://feeds.gamepix.com/v2/json?sid=1&pagination=96&page=4')
  ];
  const resList = await Promise.allSettled(reqs);
  const out = [];
  resList.forEach(res => {
    if (res.status !== 'fulfilled' || !res.value) return;
    const list = Array.isArray(res.value) ? res.value : (res.value.items || res.value.data || res.value.games || []);
    list.forEach(g => {
      const img = cleanUrl(g && (g.thumbnailUrl || g.banner_image || g.image || g.thumbnailUrl100));
      const url = cleanUrl(g && g.url);
      if (g && g.title && img && url) {
        out.push([String(g.title).trim(), normalizeCategories(g.categories || g.category), img, url]);
      }
    });
  });
  return out;
}

async function loadGameMonetize() {
  const feeds = await Promise.allSettled([
    fetchJsonFast('https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=best&company=All&amount=300'),
    fetchJsonFast('https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=newest&company=All&amount=200')
  ]);
  const out = [];
  feeds.forEach(res => {
    if (res.status !== 'fulfilled' || !res.value) return;
    const list = Array.isArray(res.value) ? res.value : (res.value.games || res.value.items || []);
    list.forEach(g => {
      const img = cleanUrl(g && (g.thumb || g.thumbnail || g.image));
      const url = cleanUrl(g && (g.url || g.link));
      if (g && g.title && img && url) {
        out.push([String(g.title).trim(), normalizeCategories(g.category || g.tags), img, url]);
      }
    });
  });
  return out;
}

async function loadHtmlGames() {
  const json = await fetchJsonFast('https://www.htmlgames.com/rss/games.php?json');
  const list = Array.isArray(json) ? json : (json && (json.games || json.items) || []);
  return list
    .filter(g => g && (g.name || g.title) && cleanUrl(g.thumb || g.thumb2 || g.thumb3 || g.thumbnail || g.image) && cleanUrl(g.url || g.embed || g.link))
    .map(g => [
      String(g.name || g.title).trim(),
      normalizeCategories(g.category || g.categories),
      cleanUrl(g.thumb || g.thumb2 || g.thumb3 || g.thumbnail || g.image),
      cleanUrl(g.url || g.embed || g.link)
    ]);
}

async function loadFamobi() {
  const json = await fetchJsonFast('https://api.famobi.com/feed');
  const list = Array.isArray(json) ? json : (json && Array.isArray(json.games) ? json.games : []);
  return list
    .filter(g => g && (g.name || g.title) && cleanUrl(g.thumb_180 || g.thumb_320 || g.thumb_120 || g.thumb) && cleanUrl(g.link || g.url))
    .map(g => [
      String(g.name || g.title).trim(),
      normalizeCategories(g.categories || g.category),
      cleanUrl(g.thumb_180 || g.thumb_320 || g.thumb_120 || g.thumb),
      cleanUrl(g.link || g.url)
    ]);
}

async function loadGameDistribution() {
  const json = await fetchJsonFast('https://catalog.api.gamedistribution.com/api/v1.0/rss/All/?format=json');
  const list = Array.isArray(json) ? json : (json && (json.games || json.items || json.data) || []);
  return list
    .filter(g => {
      const title = g && (g.Title || g.title);
      const asset = g && (Array.isArray(g.Asset) ? g.Asset[0] : (g.Asset || g.Thumb || g.thumbnail || g.image));
      const url = g && (g.Url || g.url);
      return title && cleanUrl(asset) && cleanUrl(url);
    })
    .map(g => {
      const asset = Array.isArray(g.Asset) ? g.Asset[0] : (g.Asset || g.Thumb || g.thumbnail || g.image);
      return [
        String(g.Title || g.title).trim(),
        normalizeCategories(g.Category || g.category || g.Genres),
        cleanUrl(asset),
        cleanUrl(g.Url || g.url)
      ];
    });
}

async function load4J() {
  const json = await fetchJsonFast('https://h5.4j.com/gamefeed.php');
  const list = Array.isArray(json) ? json : (json && (json.games || json.items || json.data) || []);
  return list
    .filter(g => g && (g.name || g.title) && cleanUrl(g.thumb || g.thumbnail || g.image) && cleanUrl(g.url || g.gameUrl))
    .map(g => [
      String(g.name || g.title).trim(),
      normalizeCategories(g.category || g.categories || g.tags),
      cleanUrl(g.thumb || g.thumbnail || g.image),
      cleanUrl(g.url || g.gameUrl)
    ]);
}

const FALLBACK_GAMES = [
  ["Stack Fire Ball","Arcade,Casual,Skill","https://www.onlinegames.io/media/posts/184/Stack-Fire-Ball-Game.jpg","https://www.onlinegames.io/games/2021/unity/stack-fire-ball/index.html"],
  ["Love Tester","Casual,Fun","https://www.onlinegames.io/media/posts/152/love-tester.jpg","https://www.onlinegames.io/games/2021/3/love-tester/index.html"],
  ["GTA Simulator","Action,Racing","https://www.onlinegames.io/media/posts/416/GTA-Simulator.jpg","https://www.onlinegames.io/games/2023/unity2/gta-simulator/index.html"],
  ["Masked Special Forces","Shooter,Multiplayer","https://www.onlinegames.io/media/posts/310/Masked-Special-Forces-FPS.jpg","https://www.onlinegames.io/games/2022/unity2/masked-special-forces/index.html"],
  ["Stickman GTA City","Stick man,Shooter","https://www.onlinegames.io/media/posts/900/stickman-gta-city-free.jpg","https://cloud.onlinegames.io/games/2024/unity3/stickman-gta-city/index-og.html"],
  ["Highway Traffic","Racing,Endless","https://www.onlinegames.io/media/posts/32/Highway-Traffic-2.jpg","https://www.onlinegames.io/games/2022/unity/highway-traffic/index.html"],
  ["Dont Fall io","Survival,Casual","https://www.onlinegames.io/media/posts/182/Dont-Fall-io-2.jpg","https://www.onlinegames.io/games/2021/unity/dont-fall-io/index.html"],
  ["Dinosaur Game","Endless,Arcade,Casual","https://www.onlinegames.io/media/posts/417/Dinosaur-Game-Online.jpg","https://www.onlinegames.io/games/2023/q2/dinosaur-game/index.html"],
  ["Burnout City","Racing,Action","https://www.onlinegames.io/media/posts/861/burnoutcity.jpg","https://cloud.onlinegames.io/games/2024/unity/burnout-city/index-og.html"],
  ["Edys Car Simulator","Racing,Strategy","https://www.onlinegames.io/media/posts/238/Edys-Car-Simulator-Online.jpg","https://www.onlinegames.io/games/2022/unity/edys-car-simulator/index.html"],
  ["Fast Food Rush","Casual,Strategy","https://www.onlinegames.io/media/posts/979/fast-food-rush.jpg","https://cloud.onlinegames.io/games/2025/unity/fast-food-rush/index-og.html"],
  ["Dublix","Adventure,Racing","https://www.onlinegames.io/media/posts/1126/dublix.webp","https://cloud.onlinegames.io/games/2025/unity4/dublix/game-og.html"],
  ["Snaker io","Endless,Casual","https://www.onlinegames.io/media/posts/1261/snaker-io.webp","https://cloud.onlinegames.io/games/2026/more/snaker-io/game.html"],
  ["Checkout Frenzy","Strategy,Casual","https://www.onlinegames.io/media/posts/974/checkout-frenzy-cashier-game.jpg","https://cloud.onlinegames.io/games/2025/unity/checkout-frenzy/index-og.html"],
  ["ArmedForces.io","Shooter,Multiplayer","https://www.onlinegames.io/media/posts/234/Armed-Forces-io.jpg","https://www.onlinegames.io/games/2021/unity3/armedforces-io/index.html"],
  ["Drako IO","Fighting,Action","https://www.onlinegames.io/media/posts/1304/drako-io.webp","https://cloud.onlinegames.io/games/2022/unity/drako-io/game.html"],
  ["Tile Match","Puzzle,Board,Strategy","https://www.onlinegames.io/media/posts/939/tile-match.jpg","https://www.onlinegames.io/games/2023/unity/tile-match/index.html"],
  ["Pixel Paint","Puzzle,Casual","https://assets.playkovo.com/games/pixel-paint/cover/0f7b5480-ba7d-4d6a-9189-782606a0a114.webp","https://playkovo.com/embed/pixel-paint"],
  ["Circle Bird","Endless,Casual","https://assets.playkovo.com/games/circle-bird/cover/f56d832f-95cc-425d-9b56-1ccdf9d14394.webp","https://playkovo.com/embed/circle-bird"],
  ["Sheep Climb","Endless,Casual","https://assets.playkovo.com/games/sheep-climb/cover/b54bef4c-b3d2-45cd-a8b5-8ff38be1660b.webp","https://playkovo.com/embed/sheep-climb"],
  ["Sealed Fates","Board,Strategy","https://assets.playkovo.com/games/sealed-fates/cover/bca38cd5-f311-4d9e-b9f6-ae04d9df0287.webp","https://playkovo.com/embed/sealed-fates"],
  ["3D Plank","Endless,Casual","https://assets.playkovo.com/games/3d-plank/cover/6a176cc9-8beb-4a98-9431-87cc29619b1d.webp","https://playkovo.com/embed/3d-plank"],
  ["Airplane Racer","Racing,Action","https://www.onlinegames.io/media/posts/268/Airplane-Racer.jpg","https://www.onlinegames.io/games/2022/unity/airplane-racer/index.html"],
  ["Sniper Elite","Shooter,Action","https://www.onlinegames.io/media/posts/127/Sniper-Elite-Online.jpg","https://www.onlinegames.io/games/2021/1/sniper-elite/index.html"],
  ["Jeep Racing","Racing,Multiplayer","https://www.onlinegames.io/media/posts/564/Jeep-Racing.jpg","https://www.onlinegames.io/games/2023/freezenova.com/jeep-racing/index.html"],
  ["Mini Cars Racing","Racing,Casual","https://www.onlinegames.io/media/posts/1010/Mini-Cars-Racing.jpg","https://cloud.onlinegames.io/games/2021/unity/mini-cars-racing/index-og.html"],
  ["Draw the Car Path","Puzzle,Casual","https://www.onlinegames.io/media/posts/936/draw-the-car-path.jpg","https://cloud.onlinegames.io/games/2021/4/draw-the-car-path/index-og.html"],
  ["Find It","Puzzle,Casual","https://www.onlinegames.io/media/posts/940/Find-It.jpg","https://cloud.onlinegames.io/games/2025/unity/find-it/index-og.html"],
  ["2048","Puzzle,Board,Strategy","https://www.onlinegames.io/media/posts/916/responsive/2048-xs.jpg","https://cloud.onlinegames.io/games/2025/html/2048/index.html"],
  ["Snake","Endless,Casual","https://www.onlinegames.io/media/posts/919/snake.jpg","https://cloud.onlinegames.io/games/2024/phaser/snake/index-og.html"],
  ["Steal Brainrots Multiplayer","Strategy,Casual","https://www.onlinegames.io/media/posts/1340/steal-brainrots-multiplayer-2.webp","https://cloud.onlinegames.io/games/2026/unity/steal-brainrots-multiplayer/game.html"],
  ["Ultimate Moto","Racing,Arcade","https://www.onlinegames.io/media/posts/1020/ultimate-moto.jpg","https://cloud.onlinegames.io/games/2021/2/ultimate-moto/index-og.html"],
  ["Survival Island","Survival,Strategy","https://www.onlinegames.io/media/posts/970/survival-island-gameplay.webp","https://cloud.onlinegames.io/games/2024/unity2/survival-island/index-og.html"],
  ["Futuristic Racer","Racing,Speed","https://www.onlinegames.io/media/posts/1051/futuristic_racer_game.webp","https://cloud.onlinegames.io/games/2021/2/futuristic-racer/index-og.html"],
  ["Age Of Battle","Strategy,Fighting","https://www.onlinegames.io/media/posts/1201/age-of-battle.webp","https://cloud.onlinegames.io/games/2026/unity/age-of-battle/game.html"],
  ["99 Nights in the Forest","Survival,Action","https://www.onlinegames.io/media/posts/1190/99-nights-in-the-forest.webp","https://cloud.onlinegames.io/games/2026/unity/99-nights-in-the-forest-survival/game.html"],
  ["Chess FreezeNova","Board,Strategy","https://www.onlinegames.io/media/posts/1116/chess-freezenova.webp","https://cloud.onlinegames.io/games/2025/unity3/chess/index-og.html"],
  ["Solitaire Adventure","Board,Puzzle","https://www.onlinegames.io/media/posts/519/Solitaire-Adventure-Tripeaks.jpg","https://www.onlinegames.io/games/2022/unity4/solitaire-adventure/index.html"],
  ["Crown Defense","Strategy,Casual","https://www.onlinegames.io/media/posts/1098/crown-defense-online.webp","https://cloud.onlinegames.io/games/2025/construct/337/crown-defense/index-og.html"],
  ["Snake Football","Sports,Casual","https://www.onlinegames.io/media/posts/706/Snake-Football.jpg","https://www.onlinegames.io/games/2023/construct/200/snake-football/index.html"],
  ["Basketball King","Sports,Arcade","https://www.onlinegames.io/media/posts/907/basketball-king.jpg","https://cloud.onlinegames.io/games/2024/construct/316/basketball-king/index-og.html"],
  ["Stickman Destruction","Stick man,Casual","https://www.onlinegames.io/media/posts/233/Stickman-Destruction.jpg","https://www.onlinegames.io/games/2021/unity3/stickman-destruction/index.html"],
  ["Crazy Stickman Physics","Stick man,Casual","https://www.onlinegames.io/media/posts/715/Crazy-Stickman-Physics.jpg","https://www.onlinegames.io/games/2023/construct/185/crazy-stickman-physics/index.html"],
  ["Tiny Crash Fighters","Fighting,Strategy","https://www.onlinegames.io/media/posts/622/Tiny-Crash-Fighters.jpg","https://www.onlinegames.io/games/2023/construct/285/tiny-crash-fighters/index.html"],
  ["Geometry Dart 3D","Endless,Arcade","https://www.onlinegames.io/media/posts/1433/geometry-dart-3d-2.webp","https://cloud.onlinegames.io/games/2026/unity/geometry-dart-3d/game.html"],
  ["Mini Shooters","Shooter,Action","https://www.onlinegames.io/media/posts/313/Mini-Nova-Shooters-2.jpg","https://www.onlinegames.io/games/2021/5/mini-shooters/index.html"],
  ["Rooftop Duel","Fighting,Shooter","https://www.onlinegames.io/media/posts/1002/Rooftop-Duel-Online.jpg","https://cloud.onlinegames.io/games/2025/construct/213/rooftop-duel/index-og.html"],
  ["Funny Shooter Bro","Shooter,Action","https://www.onlinegames.io/media/posts/735/Funny-Shooter-Bro.jpg","https://www.onlinegames.io/games/2024/unity/funny-shooter-bro/index.html"],
  ["Kawaii Shooter","Shooter,Action","https://www.onlinegames.io/media/posts/844/Kawaii-Shooter.jpg","https://cloud.onlinegames.io/games/2024/unity/kawaii-shooter/index-og.html"],
  ["Global Guesser","Puzzle,Casual","https://www.onlinegames.io/media/posts/972/global-guesser.jpg","https://cloud.onlinegames.io/games/2025/html/global-guesser/index-og.html#/"],
  ["Super Hot","Shooter,Fighting","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Super%20Hot.webp","https://nite.games/embed/super-hot"],
  ["GTA Advanced","Racing,Shooter","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Grand%20Theft%20Auto%20Advanced.webp","https://nite.games/embed/gta-advanced"],
  ["Minecraft","Survival,Strategy","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Minecraft.webp","https://nite.games/embed/minecraft"],
  ["CSGO Surf","Endless,Casual","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Cluster%20Rush.webp","https://nite.games/embed/csgo-surf"],
  ["Skate 3","Sports,Action","https://nite.games/skate-3.webp","https://nite.games/embed/skate-3"],
  ["Doom 3","Shooter,Survival","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Doom%203.webp","https://nite.games/embed/doom-3"],
  ["Dark Forces","Shooter,Action","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/dark-forces.webp","https://nite.games/embed/dark-forces"],
  ["Spyro Adventure","Casual,Strategy","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Spyro%20Adventure.webp","https://nite.games/embed/spyro-adventure"],
  ["007 Everything or Nothing","Shooter,Action","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/007%20Everything%20or%20Nothing.webp","https://nite.games/embed/007-everything-or-nothing"],
  ["Emulator","Casual,Strategy","https://pub-c77eb84ebd5c408aa81bb7f3302cac57.r2.dev/attached_assets/game_icons/Emulator.webp","https://nite.games/embed/emulator"]
];

function dedupeGames(list) {
  const seenUrls = new Set();
  const seenTitles = new Set();
  return list.filter(g => {
    if (!g || !g[0] || !g[2] || !g[3]) return false;
    const normTitle = String(g[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
    const normUrl = String(g[3]).split('?')[0].replace(/\/+$/, '').toLowerCase();
    if (!normTitle || !normUrl) return false;
    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) return false;
    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    return true;
  });
}

function interleaveLists(lists) {
  const out = [];
  let maxLen = 0;
  lists.forEach(l => { if (l.length > maxLen) maxLen = l.length; });
  for (let i = 0; i < maxLen; i++) {
    for (let j = 0; j < lists.length; j++) {
      if (i < lists[j].length) out.push(lists[j][i]);
    }
  }
  return out;
}

function buildGamesImmediately() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 200) {
        GAMES = dedupeGames(parsed).slice(0, TARGET_GAMES);
        setActive(currentCat);
        return;
      }
    }
  } catch (e) {}
  GAMES = dedupeGames(FALLBACK_GAMES).slice(0, TARGET_GAMES);
  setActive(currentCat);
}

async function fetchAndUpdateGames() {
  const buckets = [FALLBACK_GAMES.slice(), [], [], [], [], [], [], [], [], []];
  let reachedTarget = false;

  const mergeAndRender = (preserveScroll) => {
    const merged = dedupeGames([
      ...buckets[0],
      ...interleaveLists(buckets.slice(1))
    ]).slice(0, TARGET_GAMES);

    if (merged.length > GAMES.length) {
      GAMES = merged;
      render(currentCat, preserveScroll);
      if (GAMES.length >= 150) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(GAMES)); } catch (e) {}
      }
      if (GAMES.length >= TARGET_GAMES) reachedTarget = true;
    }
  };

  const tasks = [
    loadOnlineGames().then(d => { buckets[1] = d; }),
    loadNiteGames().then(d => { buckets[2] = d; }),
    loadPlayKovo().then(d => { buckets[3] = d; }),
    loadGamePix().then(d => { buckets[4] = d; }),
    loadGameMonetize().then(d => { buckets[5] = d; }),
    loadHtmlGames().then(d => { buckets[6] = d; }),
    loadFamobi().then(d => { buckets[7] = d; }),
    loadGameDistribution().then(d => { buckets[8] = d; }),
    load4J().then(d => { buckets[9] = d; })
  ];

  tasks.forEach(p => {
    p.then(() => {
      if (!reachedTarget) mergeAndRender(true);
    });
  });

  await Promise.allSettled(tasks);
  if (!reachedTarget) mergeAndRender(true);
}

const listEl = document.getElementById("list");
const catNameEl = document.getElementById("catName");
const catCountEl = document.getElementById("catCount");

function wreath(n) {
  const cx = 30, cy = 35, R = 19;
  let leaves = "";
  [-1, 1].forEach(side => {
    for (let i = 0; i < 7; i++) {
      const th = (22 + i * 19) * Math.PI / 180;
      const x = cx + side * R * Math.sin(th);
      const y = cy + R * Math.cos(th);
      const rot = Math.atan2(side * Math.cos(th), Math.sin(th)) * 180 / Math.PI + side * 18;
      leaves += `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="2.6" ry="5.4" transform="rotate(${rot.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})" fill="url(#goldLeaf)" stroke="#8a4f00" stroke-width="0.35"/>`;
    }
  });
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="${cx}" cy="${cy}" r="15" fill="#1a1204" opacity="0.55"/>${leaves}<path d="M23.5 17 L22.5 8.5 L27.2 12.2 L30 6.5 L32.8 12.2 L37.5 8.5 L36.5 17 Z" fill="url(#goldG)" stroke="#8a4f00" stroke-width="0.6" stroke-linejoin="round"/><text x="30" y="43" text-anchor="middle" font-size="24" font-weight="900" font-family="Inter, sans-serif" fill="url(#goldG)" stroke="#7a4600" stroke-width="0.5">${n}</text></svg>`;
}

function render(cat, preserveScroll = false) {
  const prevScroll = listEl.scrollTop;
  const filtered = cat === "All" ? GAMES : GAMES.filter(g => g[1].toLowerCase().includes(cat.toLowerCase()));
  catNameEl.textContent = cat === "All" ? "Games" : cat;
  catCountEl.textContent = filtered.length + (filtered.length === 1 ? " Game" : " Games");
  if (!filtered.length) {
    listEl.innerHTML = `<div class="empty"><i class="fa-solid fa-gamepad"></i>Is category me abhi koi game nahi hai</div>`;
    return;
  }
  listEl.innerHTML = filtered.map((g, i) => {
    const rank = i + 1;
    const badge = rank <= 3 ? `<div class="gold-badge">${wreath(rank)}</div>` : `<div class="normal-badge">${rank}</div>`;
    const cats = g[1].split(",").map(s => s.trim());
    const sub = cats.slice(0, 2).join(" · ");
    return `<div class="game-row" data-index="${GAMES.indexOf(g)}">
      <div class="rank-col">${badge}</div>
      <img class="game-icon" src="${g[2]}" alt="${g[0]}" loading="lazy" onerror="this.onerror=null;this.src='https://cdn-icons-png.flaticon.com/62/1041/1041885.png';">
      <div class="game-details">
        <div class="game-title">${g[0]}</div>
        <div class="game-sub">${sub}</div>
      </div>
    </div>`;
  }).join("");

  listEl.querySelectorAll<HTMLElement>(".game-row").forEach(row => {
    row.addEventListener("click", () => {
      const idx = parseInt(row.dataset.index || "0", 10);
      const game = GAMES[idx];
      // PASS SOURCE INFORMATION CLEARLY
      window.location.href = `player.html?url=${encodeURIComponent(game[3])}&title=${encodeURIComponent(game[0])}&from=category&cat=${encodeURIComponent(currentCat)}`;
    });
  });
  listEl.scrollTop = preserveScroll ? prevScroll : 0;
}

function setActive(cat: string) {
  currentCat = cat;
  document.querySelectorAll<HTMLElement>("[data-cat]").forEach(el => {
    el.classList.toggle("active", (el.dataset.cat || "").toLowerCase() === cat.toLowerCase());
  });
  render(cat, false);
}

document.querySelectorAll<HTMLElement>("[data-cat]").forEach(el => {
  el.addEventListener("click", () => setActive(el.dataset.cat || "All"));
});

buildGamesImmediately();
fetchAndUpdateGames();

Object.assign(window, { handleBackAction, normalizeCategories, fetchJsonText, fetchJsonpAllOrigins, raceFirstSuccess, fetchJsonFast, cleanUrl, loadOnlineGames, loadPlayKovo, loadNiteGames, loadGamePix, loadGameMonetize, loadHtmlGames, loadFamobi, loadGameDistribution, load4J, dedupeGames, interleaveLists, buildGamesImmediately, fetchAndUpdateGames, wreath, render, setActive });
