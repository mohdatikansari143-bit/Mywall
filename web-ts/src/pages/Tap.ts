export {};

(() => {
  /* ========= CONFIG ========= */
  const CFG = {
    tapValue: 0.60,          // base coin per tap
    levelBonus: 0.10,        // har level pe extra per tap (0 = hamesha 0.60)
    maxEnergy: 1000,
    energyCost: 1,
    regenPerSec: 3,
    boostsPerDay: 3,
    maxTps: 30,              // max taps/second (autoclicker limit)
    coinSrc: '../assets/coin.png',
    homeUrl: '../index.html',
    api: '',                 // server sync URL, e.g. 'https://yourdomain.com/api/tap'
    key: 'tap_state_v2'
  };
  const LEVELS: Array<[string, string, number]> = [['Bronze','🥉',0],['Silver','🥈',5000],['Gold','🥇',25000],['Platinum','💠',100000],['Diamond','💎',500000],['Legend','👑',2000000]];
  const U = 100; // integer units (float error se bachne ke liye)

  const $ = (id: string) => document.getElementById(id)!;
  const coin = $('coin'), fx = $('fx');
  const tg = window.Telegram && Telegram.WebApp;
  if (tg) {
    try { tg.ready(); tg.expand(); } catch (e) {}
    try { tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch (e) {}
    try { tg.setHeaderColor && tg.setHeaderColor('#000000'); tg.setBackgroundColor && tg.setBackgroundColor('#000000'); } catch (e) {}
  }

  document.querySelectorAll<HTMLImageElement>('img[data-coin]').forEach(im => {
    im.src = CFG.coinSrc;
    im.addEventListener('error', () => { im.closest('.coin') ? coin.classList.add('fallback') : (im.style.display = 'none'); });
  });

  /* ========= STATE ========= */
  const today = () => new Date().toISOString().slice(0, 10);
  const num = (v: any, d: number) => Number.isFinite(v) ? v : d;
  function load() {
    let s: any = {};
    try { s = JSON.parse(localStorage.getItem(CFG.key) || '{}') || {}; } catch (e) {}
    const dt = s.ts ? Math.max(0, (Date.now() - s.ts) / 1000) : 0;
    return {
      units: num(s.units, 0), taps: num(s.taps, 0), since: num(s.since, Date.now()),
      energy: Math.min(CFG.maxEnergy, num(s.energy, CFG.maxEnergy) + dt * CFG.regenPerSec),
      boost: s.boost && s.boost.d === today() ? s.boost : { d: today(), left: CFG.boostsPerDay }
    };
  }
  const S = load();
  let dirty = false, pending = 0;

  function save() {
    if (!dirty) return;
    try { localStorage.setItem(CFG.key, JSON.stringify({ ...S, ts: Date.now() })); dirty = false; } catch (e) {}
  }

  /* ========= HELPERS ========= */
  const lvl = u => { let i = 0; while (i < LEVELS.length - 1 && u >= LEVELS[i + 1][2] * U) i++; return i; };
  const tapUnits = () => Math.round((CFG.tapValue + lvl(S.units) * CFG.levelBonus) * U);
  const fmt = u => (u / U).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function haptic(type?: string) {
    if (tg && tg.HapticFeedback) type === 'ok' ? tg.HapticFeedback.notificationOccurred('success') : tg.HapticFeedback.impactOccurred('light');
    else if (navigator.vibrate) navigator.vibrate(type === 'ok' ? [20, 40, 20] : 8);
  }
  let tt;
  function toast(m) {
    const t = $('toast'); t.textContent = m; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ========= RENDER ========= */
  function renderBalance(bump) {
    const b = $('balance'); b.textContent = fmt(S.units);
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function renderLevel() {
    const i = lvl(S.units), cur = LEVELS[i], nxt = LEVELS[i + 1];
    $('lvName').textContent = cur[1] + ' ' + cur[0];
    $('perTap').textContent = (tapUnits() / U).toFixed(2);
    if (nxt) {
      const a = cur[2] * U, b = nxt[2] * U;
      $('lvBar').style.width = Math.min(100, (S.units - a) / (b - a) * 100) + '%';
      $('lvLeft').textContent = fmt(b - S.units) + ' to ' + nxt[0];
    } else { $('lvBar').style.width = '100%'; $('lvLeft').textContent = 'MAX'; }
  }
  function renderEnergy() {
    $('energyTxt').textContent = Math.floor(S.energy) + ' / ' + CFG.maxEnergy;
    $('energyFill').style.width = (S.energy / CFG.maxEnergy * 100) + '%';
    $('boostTxt').textContent = 'Full ⚡ ' + S.boost.left + '/' + CFG.boostsPerDay;
    ($('boost') as HTMLButtonElement).disabled = S.boost.left <= 0 || S.energy >= CFG.maxEnergy;
  }

  /* ========= EFFECTS ========= */
  function spawnFx(x, y, v) {
    if (fx.childElementCount > 45) return;
    const t = document.createElement('div');
    t.className = 'float';
    t.textContent = '+' + (v / U).toFixed(2);
    t.style.left = (x + Math.random() * 40 - 20) + 'px';
    t.style.top = y + 'px';
    t.addEventListener('animationend', () => t.remove());
    fx.appendChild(t);
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('i');
      p.className = 'spark'; p.style.left = x + 'px'; p.style.top = y + 'px';
      fx.appendChild(p);
      const a = Math.random() * 6.283, d = 30 + Math.random() * 45;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 }
      ], { duration: 500, easing: 'ease-out' }).onfinish = () => p.remove();
    }
  }
  function shake() {
    const e = $('energy'); e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake');
  }

  /* ========= TAP ========= */
  const active = new Set(), stamps = [];
  const allowed = () => {
    const n = performance.now();
    while (stamps.length && n - stamps[0] > 1000) stamps.shift();
    if (stamps.length >= CFG.maxTps) return false;
    stamps.push(n); return true;
  };

  coin.addEventListener('pointerdown', e => {
    e.preventDefault();
    active.add(e.pointerId);
    const r = coin.getBoundingClientRect();
    coin.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 26 + 'deg');
    coin.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 26 + 'deg');
    coin.classList.add('press');

    if (!e.isTrusted || !allowed()) return;
    if (S.energy < CFG.energyCost) { shake(); return; }

    const before = lvl(S.units), v = tapUnits();
    S.energy -= CFG.energyCost; S.units += v; S.taps++; pending++; dirty = true;
    renderBalance(true); renderEnergy(); renderLevel();
    spawnFx(e.clientX, e.clientY, v);
    haptic();

    const after = lvl(S.units);
    if (after !== before) { toast('🎉 ' + LEVELS[after][1] + ' ' + LEVELS[after][0] + ' unlocked!'); haptic('ok'); }
  });

  const release = e => {
    active.delete(e.pointerId);
    if (!active.size) {
      coin.classList.remove('press');
      coin.style.setProperty('--rx', '0deg'); coin.style.setProperty('--ry', '0deg');
    }
  };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => coin.addEventListener(ev, release));

  /* ========= BOOST ========= */
  $('boost').addEventListener('click', () => {
    if (S.boost.d !== today()) S.boost = { d: today(), left: CFG.boostsPerDay };
    if (S.boost.left <= 0 || S.energy >= CFG.maxEnergy) return;
    S.boost.left--; S.energy = CFG.maxEnergy; dirty = true;
    renderEnergy(); toast('⚡ Energy full!'); haptic('ok');
  });

  /* ========= ENERGY REGEN ========= */
  let last = performance.now();
  setInterval(() => {
    const now = performance.now(), dt = (now - last) / 1000; last = now;
    if (S.energy < CFG.maxEnergy) {
      S.energy = Math.min(CFG.maxEnergy, S.energy + dt * CFG.regenPerSec);
      dirty = true; renderEnergy();
    }
  }, 250);

  /* ========= TELEGRAM PROFILE (username + user id) ========= */
  const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  const fullName = user ? ([user.first_name, user.last_name].filter(Boolean).join(' ') || 'User') : 'Player';
  const handle = user ? (user.username ? '@' + user.username : fullName) : 'Player';
  const uid = user ? String(user.id) : '—';

  $('chipName').textContent = handle;
  $('chipId').textContent = 'ID: ' + uid;
  $('pName').textContent = fullName;
  $('pUser').textContent = user ? (user.username ? '@' + user.username : 'No username set') : 'Guest mode';
  $('sId').textContent = uid;

  document.querySelectorAll('[data-avatar]').forEach(av => {
    if (user && user.photo_url) {
      const im = new Image(); im.src = user.photo_url; im.alt = '';
      av.textContent = ''; av.appendChild(im);
    } else av.textContent = (fullName.charAt(0) || 'P').toUpperCase();
  });

  $('idStat').addEventListener('click', () => {
    if (!user) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(uid).then(() => { toast('ID copied'); haptic('ok'); }, () => {});
    }
  });

  /* ========= PROFILE SHEET ========= */
  const sheet = $('sheet');
  const closeSheet = () => sheet.classList.remove('open');
  $('profileBtn').addEventListener('click', () => {
    const i = lvl(S.units);
    $('sEarn').textContent = fmt(S.units);
    $('sTaps').textContent = S.taps.toLocaleString('en-IN');
    $('sPer').textContent = '+' + (tapUnits() / U).toFixed(2);
    $('sLv').textContent = LEVELS[i][1] + ' ' + LEVELS[i][0];
    $('sSince').textContent = new Date(S.since).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    sheet.classList.add('open');
  });
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

  /* ========= NAVIGATION ========= */
  $('backBtn').addEventListener('click', () => {
    if (sheet.classList.contains('open')) return closeSheet();
    dirty = true; save();
    history.length > 1 ? history.back() : (location.href = CFG.homeUrl);
  });

  /* ========= SAVE + SERVER SYNC ========= */
  async function sync() {
    if (!CFG.api || !pending) return;
    const n = pending; pending = 0;
    try {
      const r = await fetch(CFG.api, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taps: n, initData: tg ? tg.initData : '', t: Date.now() })
      });
      if (!r.ok) throw 0;
    } catch (e) { pending += n; }
  }
  setInterval(save, 1000);
  setInterval(sync, 5000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { dirty = true; save(); sync(); } });
  addEventListener('pagehide', () => { dirty = true; save(); });

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('gesturestart', e => e.preventDefault());

  renderBalance(false); renderLevel(); renderEnergy();
})();
