export {};

// Image 1: Butterfly Heart Path
const BUTTERFLY_HEART_SVG = `
<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" class="heart-ico">
  <path d="M31.2,22.8 C35.5,13.2 46.8,11.5 52.4,18.2 C57.8,24.6 55.4,36.2 46.2,46.1 C39.8,53 32.5,58.8 31.2,59.8 C30.6,58.4 25.5,52.8 22.8,49.8 C27.5,47.2 40.5,36.5 43.6,29.8 C46.2,24.1 43.8,18.8 38.6,18.8 C34.5,18.8 31.8,22 31.2,22.8 Z"/>
  <path d="M29.5,33.8 C30.2,30.8 31.8,27.8 33.2,27.2 C34,27.8 33.2,30.8 31.6,34.5 Z"/>
  <circle cx="34" cy="26.2" r="1.6"/>
  <path d="M34.5,25.2 C35.4,22.5 36.8,20.2 38.4,19.5 M34.5,25.2 C36.8,24.5 39,25.2 41,26.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="38.7" cy="19.3" r="0.9"/>
  <circle cx="41.3" cy="26.7" r="0.9"/>
  <path fill-rule="evenodd" d="M31,28.5 C26.8,21.5 20.8,14.5 10.5,15.2 C8.2,21.5 9,30.5 13.5,35.5 C16.5,35.5 25.2,33.2 31,28.5 Z M13.8,19.8 C18.2,19.8 23.2,24.2 27.5,27.8 C23,27 18,23.8 13.8,19.8 Z M14.8,24.5 C19.8,25.2 24.2,28.2 28.5,29.8 C23.5,29 18.5,26.8 14.8,24.5 Z M16.2,30.5 C20.8,31 24.8,31.8 28.5,31 C24.2,31.8 19.8,31.8 16.2,30.5 Z"/>
  <path fill-rule="evenodd" d="M30.2,33.5 C23.8,33.5 14.5,35 13.2,42.5 C14.5,47 21.2,49.2 27,43.5 C28.2,40.5 29.5,36.8 30.2,33.5 Z M16.8,40.2 C20.5,39.5 24.2,38 27.5,35.8 C24,37.2 20.5,38.8 16.8,40.2 Z M19.2,44.2 C22.8,42.8 25.5,39.8 27.5,37.5 C24.8,39.8 22,42 19.2,44.2 Z"/>
</svg>`;

// Image 2: F*** You Typography Middle Finger
const MIDDLE_FINGER_SVG = `
<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" class="dis-ico">
  <path d="M29.5,5.5 C29.5,2.8 34.5,2.8 34.5,5.5 L34.5,40.5 C34.5,41.5 29.5,41.5 29.5,40.5 Z"/>
  <path d="M21.5,29.5 L12.5,35 C11,37.8 12.5,42.5 16,45.5 L21.5,49.5 L21.5,42 L16.8,39.5 L21.5,36.5 Z"/>
  <path d="M22,23.5 C22,21.5 28.5,21.5 28.5,23.5 L28.5,40.5 L22,40.5 Z"/>
  <path d="M35.5,24.8 C35.5,22.8 43.5,22.8 43.5,24.8 L43.5,30 L39,30 L39,35 L43.5,35 L43.5,40.5 L35.5,40.5 Z"/>
  <path d="M45,30.5 L49.5,30 C51.5,30 52.2,31.5 51.5,33.5 L48,37 L52.2,44 L48.5,44 L45.5,38.5 L45.5,44 L43,44 L43,31.5 L45,31.5 Z"/>
  <path d="M17,47 L21.2,47 L24,52.5 L26.8,47 L31,47 L26.2,55.5 L26.2,60.5 L22,60.5 L22,55.5 Z"/>
  <path fill-rule="evenodd" d="M30.5,47.5 C29,51 29,56 30.5,59.5 C32.5,61 37,61 39,59.5 C40.5,56 40.5,51 39,47.5 C37,46 32.5,46 30.5,47.5 Z M33.2,50.5 C35.8,50.5 36.5,52.5 36.5,54 C36.5,56 35.8,57.5 33.2,57.5 C31.8,57.5 31.2,56 31.2,54 C31.2,52.5 31.8,50.5 33.2,50.5 Z"/>
  <path d="M40,47 L44,47 L44,55 C44,57.8 47.5,57.8 47.5,55 L47.5,47 L51.5,47 L51.5,55 C51.5,60 40,60 40,55 Z"/>
</svg>`;

const DURATION = 16;

const posts = [
  {img:"https://i.imgflip.com/7a3pa3.png", cap:"“i can’t”", name:"Daniel", handle:"@danielinverted", av:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=100&auto=format&fit=crop&q=80", likes:38, comments:1},
  {img:"https://picsum.photos/seed/reel2/800/1200", cap:"monday mood", name:"Riya", handle:"@riya.vibes", av:"https://picsum.photos/seed/av2/100", likes:124, comments:9},
  {img:"https://picsum.photos/seed/reel3/800/1200", cap:"no thoughts, just vibes", name:"Aman", handle:"@aman.exe", av:"https://picsum.photos/seed/av3/100", likes:512, comments:37},
  {img:"https://picsum.photos/seed/reel4/800/1200", cap:"bhai kya hi bolu", name:"Neha", handle:"@neha.daily", av:"https://picsum.photos/seed/av4/100", likes:76, comments:4},
  {img:"https://picsum.photos/seed/reel5/800/1200", cap:"last one, promise", name:"Kabir", handle:"@kabir.clips", av:"https://picsum.photos/seed/av5/100", likes:1203, comments:88}
];

const fmt = (n: number) => n>=1000 ? (n/1000).toFixed(1).replace('.0','')+'K' : String(n);
const feed = document.getElementById('feed') as HTMLElement;
const appEl = document.getElementById('app') as HTMLElement;

feed.innerHTML = posts.map((p,i)=>`
<section class="reel" data-i="${i}">
  <div class="media"><img src="${p.img}" alt="" onerror="this.style.display='none';this.parentNode.style.background='#000'"></div>
  <div class="caption">${p.cap}</div>
  <div class="hit"></div>
  <svg class="pause-ind" viewBox="0 0 24 24" fill="#fff" style="filter:drop-shadow(0 0 12px #000)"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>

  <div class="rail">
    <!-- LIKE BUTTON -->
    <div class="unit like"><div class="pill"><span class="ring"></span>
      ${BUTTERFLY_HEART_SVG}</div>
      <span class="cnt">${fmt(p.likes)}</span></div>

    <!-- DISLIKE BUTTON -->
    <div class="unit dislike"><div class="pill"><span class="dis-ring"></span>
      ${MIDDLE_FINGER_SVG}</div>
      <span class="cnt">Dislike</span></div>

    <!-- COMMENT BUTTON -->
    <div class="unit comment-btn"><div class="pill">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
      <span class="cnt">${p.comments}</span></div>

    <!-- SHARE BUTTON -->
    <div class="unit share-btn"><div class="pill">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
      <span class="cnt">Share</span></div>

    <!-- MENU BUTTON -->
    <div class="unit menu-btn"><div class="pill">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></div></div>
  </div>

  ${i===0?'<div class="hint">swipe up ↑</div>':''}

  <div class="bottom">
    <div class="profile"><img src="${p.av}" alt=""><div><span class="dn">${p.name}</span><span class="hn">${p.handle}</span></div></div>
    <div class="bar"><div class="fill"></div></div>
    <div class="ctrl">
      <div class="grp">
        <svg class="pp" width="18" height="18" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
        <span class="time">-0:${DURATION}</span>
      </div>
      <div class="grp">
        <span class="spd">1x</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
      </div>
    </div>
  </div>
</section>`).join('');

/* ---------- state ---------- */
const state = posts.map(p=>({liked:false,disliked:false,base:p.likes}));
const reels = [...document.querySelectorAll<HTMLElement>('.reel')];
let playbackSpeed = 1;
let autoScroll = false;

function render(i: number){
  const r = reels[i], s = state[i];
  r.querySelector('.like')!.classList.toggle('liked', s.liked);
  r.querySelector('.dislike')!.classList.toggle('disliked', s.disliked);
  r.querySelector('.like .cnt')!.textContent = fmt(s.base + (s.liked?1:0));
}
function setLike(i: number, v: boolean){
  const s = state[i]; if(s.liked===v) return;
  s.liked = v; if(v) s.disliked = false; render(i);
}

/* ---------- Fast Snappy Scroll Helper ---------- */
let snapAnim: number | null = null;
function snapToReel(idx: number){
  idx = Math.max(0, Math.min(reels.length - 1, idx));
  const start = feed.scrollTop;
  const target = idx * feed.clientHeight;
  if(Math.abs(target - start) < 2) return;
  if(snapAnim) cancelAnimationFrame(snapAnim);
  feed.style.scrollSnapType = 'none';
  const t0 = performance.now();
  const dur = 180;
  function step(now: number){
    const p = Math.min(1, (now - t0) / dur);
    const ease = 1 - Math.pow(1 - p, 3);
    feed.scrollTop = start + (target - start) * ease;
    if(p < 1){
      snapAnim = requestAnimationFrame(step);
    } else {
      feed.style.scrollSnapType = 'y mandatory';
      snapAnim = null;
    }
  }
  snapAnim = requestAnimationFrame(step);
}

/* Fast touch flick & wheel snap */
let fStartY = 0, fStartX = 0, fStartT = 0;
feed.addEventListener('touchstart', e => {
  if(snapAnim){ cancelAnimationFrame(snapAnim); snapAnim = null; feed.style.scrollSnapType = 'y mandatory'; }
  fStartY = e.touches[0].clientY;
  fStartX = e.touches[0].clientX;
  fStartT = Date.now();
}, {passive:true});

feed.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - fStartY;
  const dx = e.changedTouches[0].clientX - fStartX;
  const dt = Date.now() - fStartT;
  if(dt < 350 && Math.abs(dy) > 32 && Math.abs(dy) > Math.abs(dx) * 1.2){
    snapToReel(active + (dy < 0 ? 1 : -1));
  }
}, {passive:true});

let wheelLock = false;
feed.addEventListener('wheel', e => {
  if(Math.abs(e.deltaY) < 8) return;
  e.preventDefault();
  if(wheelLock) return;
  wheelLock = true;
  snapToReel(active + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => { wheelLock = false; }, 230);
}, {passive:false});

/* ---------- Double-tap Butterfly Burst ---------- */
function burst(reel, x, y){
  const b = document.createElement('div');
  b.className = 'burst'; b.style.left = x+'px'; b.style.top = y+'px';
  let h = `<div class="shock"></div>
  <div class="big" style="color:#ff5fa2;">${BUTTERFLY_HEART_SVG}</div>`;
  for(let k=0;k<8;k++){
    const a = (Math.PI*2*k/8) + Math.random()*.5, d = 80+Math.random()*60;
    h += `<div class="mini" style="color:${['#ff3d8b','#ff9a5a','#b25cff','#ff6fb5'][k%4]};--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d-20}px;--s:${.7+Math.random()*.8};--r:${(Math.random()-.5)*100}deg;--d:${.7+Math.random()*.3}s">${BUTTERFLY_HEART_SVG}</div>`;
  }
  for(let k=0;k<8;k++){
    const a = Math.random()*Math.PI*2, d = 60+Math.random()*80;
    h += `<span class="spark" style="--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d}px;--s:1;--r:0deg"></span>`;
  }
  b.innerHTML = h; reel.appendChild(b);
  setTimeout(()=>b.remove(), 1400);
  if(navigator.vibrate) navigator.vibrate(18);
}

/* ---------- Dislike Burst Animation ---------- */
function dislikeBurst(btn) {
  const pill = btn.querySelector('.pill');
  const b = document.createElement('div');
  b.className = 'dislike-float-burst';
  b.innerHTML = MIDDLE_FINGER_SVG;
  pill.appendChild(b);
  setTimeout(() => b.remove(), 700);
  if(navigator.vibrate) navigator.vibrate(22);
}

/* ---------- Long Press (opens Action/Download sheet) + Taps ---------- */
const lpSheet = document.getElementById('lpSheet') as HTMLElement;
const scrim = document.getElementById('scrim') as HTMLElement;
const sheet = document.getElementById('sheet') as HTMLElement;

const openSheet = () => {
  sheet.classList.add('show');
  scrim.classList.add('show');
};

function openThreeLineMenu(){
  lpSheet.classList.add('show');
  scrim.classList.add('show');
}

reels.forEach((r,i)=>{
  const hit = r.querySelector('.hit') as HTMLElement;
  let last = 0, timer: any = null;
  let lpTimer: any = null, lpTriggered = false, pX = 0, pY = 0;

  hit.addEventListener('pointerdown', (e: PointerEvent) => {
    lpTriggered = false;
    pX = e.clientX;
    pY = e.clientY;
    clearTimeout(lpTimer);
    lpTimer = setTimeout(() => {
      lpTriggered = true;
      clearTimeout(timer);
      openSheet();
      if(navigator.vibrate) navigator.vibrate(24);
    }, 420);
  });

  hit.addEventListener('pointermove', (e: PointerEvent) => {
    if(Math.hypot(e.clientX - pX, e.clientY - pY) > 10){
      clearTimeout(lpTimer);
    }
  });

  hit.addEventListener('pointerup', () => clearTimeout(lpTimer));
  hit.addEventListener('pointercancel', () => clearTimeout(lpTimer));
  hit.addEventListener('contextmenu', e => e.preventDefault());

  hit.addEventListener('click', e=>{
    if(lpTriggered){
      lpTriggered = false;
      return;
    }
    const now = Date.now(), rect = r.getBoundingClientRect();
    if(now-last < 300){
      clearTimeout(timer); last = 0;
      burst(r, e.clientX-rect.left, e.clientY-rect.top);
      setLike(i, true);
    } else {
      last = now;
      timer = setTimeout(()=>r.classList.toggle('paused'), 300);
    }
  });

  r.querySelector('.like')!.addEventListener('click',()=>setLike(i,!state[i].liked));

  // Dislike Button Click With Dedicated Middle Finger Animation
  r.querySelector('.dislike')!.addEventListener('click',()=>{
    const s = state[i];
    s.disliked = !s.disliked;
    if(s.disliked){
      s.liked = false;
      dislikeBurst(r.querySelector('.dislike'));
    }
    render(i);
  });

  r.querySelector('.pp')!.addEventListener('click',()=>r.classList.toggle('paused'));
});

/* ---------- active reel + progress ---------- */
let active = 0, elapsed = 0, lastT = performance.now();
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting && e.intersectionRatio>.6){
      const target = e.target as HTMLElement;
      reels.forEach(r=>r.classList.remove('active'));
      target.classList.add('active');
      active = +(target.dataset.i || 0); elapsed = 0;
      target.classList.remove('paused');
    }
  });
},{root:feed,threshold:[.6]});
reels.forEach(r=>io.observe(r));
reels[0].classList.add('active');

function tick(t: number){
  const dt = (t-lastT)/1000; lastT = t;
  const r = reels[active];
  if(!r.classList.contains('paused')){
    elapsed += dt * playbackSpeed;
    if(elapsed >= DURATION){
      elapsed = 0;
      if(autoScroll && active < reels.length - 1){
        snapToReel(active + 1);
      }
    }
    r.querySelector<HTMLElement>('.fill')!.style.width = (elapsed/DURATION*100)+'%';
    r.querySelector('.time')!.textContent = '-0:'+String(Math.max(0,Math.ceil(DURATION-elapsed))).padStart(2,'0');
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* keyboard support (fast snap) */
addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){ e.preventDefault(); snapToReel(active+1); }
  if(e.key==='ArrowUp'){ e.preventDefault(); snapToReel(active-1); }
});

/* ---------- bottom sheets & navigation ---------- */
const toast=document.getElementById('toast') as HTMLElement;
const shareSheet=document.getElementById('shareSheet') as HTMLElement, shareFrame=document.getElementById('shareFrame') as HTMLIFrameElement;
const commentSheet=document.getElementById('commentSheet') as HTMLElement, commentFrame=document.getElementById('commentFrame') as HTMLIFrameElement;
let toastT: any;
const showToast=(m: string)=>{toast.textContent=m;toast.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toast.classList.remove('show'),2000)};

const closeSheet=()=>{
  sheet.classList.remove('show');
  lpSheet.classList.remove('show');
  shareSheet.classList.remove('show');
  commentSheet.classList.remove('show');
  scrim.classList.remove('show');
};

/* 3-Line Sheet Actions */
document.getElementById('lpFullscreen')!.addEventListener('click', () => {
  const isFs = appEl.classList.toggle('fs');
  document.getElementById('lpFsText')!.textContent = isFs ? 'Exit fullscreen' : 'View fullscreen';
  closeSheet();
  showToast(isFs ? 'Fullscreen enabled' : 'Exited fullscreen');
});

document.querySelectorAll<HTMLElement>('#spdGroup .spd-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('#spdGroup .spd-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    playbackSpeed = parseFloat(btn.dataset.spd || '1');
    const label = btn.textContent;
    document.querySelectorAll('.spd').forEach(s => s.textContent = label);
    showToast('Speed ' + label);
  });
});

document.getElementById('lpAutoScroll')!.addEventListener('click', () => {
  autoScroll = !autoScroll;
  document.getElementById('autoScrollSw')!.classList.toggle('on', autoScroll);
  showToast(autoScroll ? 'Auto scroll ON' : 'Auto scroll OFF');
});

document.getElementById('lpCaptions')!.addEventListener('click', () => {
  const off = appEl.classList.toggle('cc-off');
  document.getElementById('lpCcText')!.textContent = off ? 'Closed Captions (Off)' : 'Closed Captions';
  closeSheet();
  showToast(off ? 'Closed Captions OFF' : 'Closed Captions ON');
});

/* ---------- Instant Download with Trexwallet Bottom Watermark Bar (Image 2 style) ---------- */
function drawTrexWatermarkBar(ctx, W, H_img, barH) {
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, H_img, W, barH);

  const fontSize = Math.max(18, Math.round(barH * 0.42));
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  const text = 'Trexwallet';
  const textWidth = ctx.measureText(text).width;

  const padRight = Math.round(barH * 0.36);
  const gap = Math.round(barH * 0.16);
  const radius = Math.round(barH * 0.27);
  const centerY = H_img + barH / 2;

  const textX = W - padRight - textWidth;
  const iconCx = textX - gap - radius;
  const iconCy = centerY;

  ctx.save();
  const grad = ctx.createLinearGradient(iconCx - radius, iconCy - radius, iconCx + radius, iconCy + radius);
  grad.addColorStop(0, '#10b981');
  grad.addColorStop(1, '#059669');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(iconCx, iconCy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(iconCx - radius, iconCy - radius);
  const s = (radius * 2) / 100;
  ctx.scale(s, s);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(35, 21);
  ctx.lineTo(73, 21);
  ctx.quadraticCurveTo(80, 21, 80, 28);
  ctx.lineTo(80, 44);
  ctx.lineTo(56, 44);
  ctx.lineTo(53, 50);
  ctx.lineTo(72, 50);
  ctx.lineTo(72, 58);
  ctx.lineTo(50, 58);
  ctx.lineTo(50, 81);
  ctx.lineTo(27, 81);
  ctx.lineTo(27, 30);
  ctx.quadraticCurveTo(27, 21, 35, 21);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(46, 31, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(text, textX, centerY + 1);
}

async function loadImageCORS(url) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('fetch err');
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    return await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => { URL.revokeObjectURL(objUrl); resolve(im); };
      im.onerror = err => { URL.revokeObjectURL(objUrl); reject(err); };
      im.src = objUrl;
    });
  } catch (e) {
    return await new Promise((resolve, reject) => {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url + (url.includes('?') ? '&' : '?') + 'cw=' + Date.now();
    });
  }
}

/* Preload all post images in background so Download is instant */
const corsCache = new Map();     // idx -> Image | null (null = CORS blocked)
const preloadJobs = new Map();   // idx -> Promise

function preloadPost(idx) {
  if (preloadJobs.has(idx)) return preloadJobs.get(idx);
  const job = loadImageCORS(posts[idx].img)
    .then(im => { corsCache.set(idx, im); return im; })
    .catch(() => { corsCache.set(idx, null); return null; });
  preloadJobs.set(idx, job);
  return job;
}
posts.forEach((_, idx) => preloadPost(idx));

function dataURLToBlobUrl(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bin = atob(parts[1]);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([u8], { type: mime }));
}

function saveToLocalStorageRecord(post, dataUrlOrUrl) {
  try {
    const key = 'trexwallet_downloads';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift({
      id: Date.now(),
      name: post.name,
      handle: post.handle,
      caption: post.cap,
      watermark: 'Trexwallet',
      media: dataUrlOrUrl,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
  } catch (e) {}
}

function triggerFileSave(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function exportCanvasInstant(drawSourceFn, W, H_img, post, idx) {
  const barH = Math.max(74, Math.round(W * 0.095));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H_img + barH;
  const ctx = canvas.getContext('2d');

  drawSourceFn(ctx, W, H_img);
  drawTrexWatermarkBar(ctx, W, H_img, barH);

  const dataUrl = canvas.toDataURL('image/png');
  const blobUrl = dataURLToBlobUrl(dataUrl);
  triggerFileSave(blobUrl, `trexwallet-post-${idx + 1}.png`);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

  try {
    saveToLocalStorageRecord(post, canvas.toDataURL('image/jpeg', 0.72));
  } catch (e) {
    saveToLocalStorageRecord(post, post.img);
  }
  showToast('Saved with Trexwallet logo');
}

function saveImageNow(im: HTMLImageElement | null, post: any, idx: number) {
  if (im) {
    const W = Math.max(720, im.naturalWidth || 720);
    const H_img = Math.round((im.naturalHeight || 1080) * (W / (im.naturalWidth || 720)));
    exportCanvasInstant((ctx: CanvasRenderingContext2D, w: number, h: number) => ctx.drawImage(im, 0, 0, w, h), W, H_img, post, idx);
  } else {
    exportCanvasInstant((ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'italic 900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(post.cap || post.name, w / 2, h / 2);
    }, 800, 1000, post, idx);
  }
}

async function downloadActivePost() {
  const idx = active;
  const post = posts[idx];
  const activeReel = reels[idx];
  const vid = activeReel.querySelector<HTMLVideoElement>('.media video');

  // Video post: save current frame instantaneously with Trexwallet logo
  if (vid && vid.readyState >= 2) {
    try {
      const W = Math.max(720, vid.videoWidth || 720);
      const H_vid = Math.round((vid.videoHeight || 1280) * (W / (vid.videoWidth || 720)));
      exportCanvasInstant((ctx: CanvasRenderingContext2D, w: number, h: number) => ctx.drawImage(vid, 0, 0, w, h), W, H_vid, post, idx);
      return;
    } catch (e) {}
  }

  // Already preloaded -> 100% synchronous instant save
  if (corsCache.has(idx)) {
    saveImageNow(corsCache.get(idx), post, idx);
    return;
  }

  // If preload still in flight, wait briefly then save
  const im = await Promise.race([
    preloadPost(idx),
    new Promise<null>(res => setTimeout(() => res(null), 1200))
  ]);
  saveImageNow(im as HTMLImageElement | null, post, idx);
}

/* Open Comment Sheet */
const openComment=()=>{
  if(!commentFrame.getAttribute('src')){
    commentFrame.src = 'comment.html';
  }
  commentSheet.classList.add('show');
};

/* Attach Back Button inside commentFrame iframe to close it cleanly */
commentFrame.addEventListener('load', () => {
  try {
    const doc = commentFrame.contentDocument || commentFrame.contentWindow?.document;
    if (doc) {
      const backBtn = doc.querySelector<HTMLElement>('header button, .back, button:has(.ph-arrow-left)');
      if (backBtn) {
        backBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeSheet();
        };
      }
    }
  } catch(e) {}
});

/* Click comment button to open */
document.querySelectorAll('.comment-btn').forEach(b=>b.addEventListener('click',e=>{
  e.stopPropagation();
  openComment();
}));

/* Close on message from comment.html or share.html */
addEventListener('message',e=>{
  if(e.data==='close-sheet' || e.data==='go-back') closeSheet();
});

/* Share Sheet */
const openShare=()=>{
  if(!shareFrame.getAttribute('src')){
    shareFrame.addEventListener('load',()=>{
      try{
        const c = shareFrame.contentDocument?.querySelector<HTMLElement>('.share-container');
        if(c) shareSheet.style.height = c.offsetHeight + 'px';
      }catch(e){}
    });
    shareFrame.src = 'share.html';
  }
  shareSheet.classList.add('show');
  scrim.classList.add('show');
};
document.querySelectorAll('.share-btn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openShare()}));

/* 3-Line Menu button opens Image 1 menu */
document.querySelectorAll('.menu-btn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openThreeLineMenu()}));
scrim.addEventListener('click',closeSheet);

const actLabels: Record<string, string> = {report:'Reported',suggested:'Marked as suggested',repost:'Reposted',copy:'Link copied'};
sheet.querySelectorAll<HTMLElement>('.sheet-item').forEach(it=>it.addEventListener('click',()=>{
  const a=it.dataset.act || '';
  if(a==='copy'){try{navigator.clipboard.writeText(location.href)}catch(e){}}
  closeSheet();
  if(a==='download'){
    downloadActivePost();
    return;
  }
  showToast(actLabels[a] || '');
}));
addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

/* ============================================================== */
/* ⬅️ RIGHT-TO-LEFT SWIPE TO OPEN COMMENT PAGE GESTURE           */
/* ============================================================== */
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

appEl.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}, { passive: true });

appEl.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  const duration = Date.now() - touchStartTime;

  // Swipe Right to Left (⬅️)
  if (deltaX < -55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && duration < 500) {
    if (!commentSheet.classList.contains('show')) {
      openComment();
    }
  }
}, { passive: true });

Object.assign(window, { render, setLike, snapToReel, burst, dislikeBurst, openThreeLineMenu, tick, drawTrexWatermarkBar, loadImageCORS, preloadPost, dataURLToBlobUrl, saveToLocalStorageRecord, triggerFileSave, exportCanvasInstant, saveImageNow, downloadActivePost });
