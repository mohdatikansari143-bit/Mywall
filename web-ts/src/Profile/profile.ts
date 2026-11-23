export {};

  const LIKE_SVG_HTML = `
    <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" class="like-icon">
      <path d="M31.2,22.8 C35.5,13.2 46.8,11.5 52.4,18.2 C57.8,24.6 55.4,36.2 46.2,46.1 C39.8,53 32.5,58.8 31.2,59.8 C30.6,58.4 25.5,52.8 22.8,49.8 C27.5,47.2 40.5,36.5 43.6,29.8 C46.2,24.1 43.8,18.8 38.6,18.8 C34.5,18.8 31.8,22 31.2,22.8 Z"/>
      <path d="M29.5,33.8 C30.2,30.8 31.8,27.8 33.2,27.2 C34,27.8 33.2,30.8 31.6,34.5 Z"/>
      <circle cx="34" cy="26.2" r="1.6"/>
      <path d="M34.5,25.2 C35.4,22.5 36.8,20.2 38.4,19.5 M34.5,25.2 C36.8,24.5 39,25.2 41,26.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <circle cx="38.7" cy="19.3" r="0.9"/>
      <circle cx="41.3" cy="26.7" r="0.9"/>
      <path fill-rule="evenodd" d="M31,28.5 C26.8,21.5 20.8,14.5 10.5,15.2 C8.2,21.5 9,30.5 13.5,35.5 C16.5,35.5 25.2,33.2 31,28.5 Z M13.8,19.8 C18.2,19.8 23.2,24.2 27.5,27.8 C23,27 18,23.8 13.8,19.8 Z M14.8,24.5 C19.8,25.2 24.2,28.2 28.5,29.8 C23.5,29 18.5,26.8 14.8,24.5 Z M16.2,30.5 C20.8,31 24.8,31.8 28.5,31 C24.2,31.8 19.8,31.8 16.2,30.5 Z"/>
      <path fill-rule="evenodd" d="M30.2,33.5 C23.8,33.5 14.5,35 13.2,42.5 C14.5,47 21.2,49.2 27,43.5 C28.2,40.5 29.5,36.8 30.2,33.5 Z M16.8,40.2 C20.5,39.5 24.2,38 27.5,35.8 C24,37.2 20.5,38.8 16.8,40.2 Z M19.2,44.2 C22.8,42.8 25.5,39.8 27.5,37.5 C24.8,39.8 22,42 19.2,44.2 Z"/>
    </svg>`;

  const DISLIKE_SVG_HTML = `
    <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" class="dislike-icon">
      <path d="M29.5,5.5 C29.5,2.8 34.5,2.8 34.5,5.5 L34.5,40.5 C34.5,41.5 29.5,41.5 29.5,40.5 Z"/>
      <path d="M21.5,29.5 L12.5,35 C11,37.8 12.5,42.5 16,45.5 L21.5,49.5 L21.5,42 L16.8,39.5 L21.5,36.5 Z"/>
      <path d="M22,23.5 C22,21.5 28.5,21.5 28.5,23.5 L28.5,40.5 L22,40.5 Z"/>
      <path d="M35.5,24.8 C35.5,22.8 43.5,22.8 43.5,24.8 L43.5,30 L39,30 L39,35 L43.5,35 L43.5,40.5 L35.5,40.5 Z"/>
      <path d="M45,30.5 L49.5,30 C51.5,30 52.2,31.5 51.5,33.5 L48,37 L52.2,44 L48.5,44 L45.5,38.5 L45.5,44 L43,44 L43,31.5 L45,31.5 Z"/>
      <path d="M17,47 L21.2,47 L24,52.5 L26.8,47 L31,47 L26.2,55.5 L26.2,60.5 L22,60.5 L22,55.5 Z"/>
      <path fill-rule="evenodd" d="M30.5,47.5 C29,51 29,56 30.5,59.5 C32.5,61 37,61 39,59.5 C40.5,56 40.5,51 39,47.5 C37,46 32.5,46 30.5,47.5 Z M33.2,50.5 C35.8,50.5 36.5,52.5 36.5,54 C36.5,56 35.8,57.5 33.2,57.5 C31.8,57.5 31.2,56 31.2,54 C31.2,52.5 31.8,50.5 33.2,50.5 Z"/>
      <path d="M40,47 L44,47 L44,55 C44,57.8 47.5,57.8 47.5,55 L47.5,47 L51.5,47 L51.5,55 C51.5,60 40,60 40,55 Z"/>
    </svg>`;

  function renderPostActions() {
    document.querySelectorAll<HTMLElement>('.pacts').forEach(bar => {
      const likes = bar.dataset.likes || '0';
      const dislikes = bar.dataset.dislikes || '0';
      const comments = bar.dataset.comments || '0';
      const views = bar.dataset.views || '0';
      const isLiked = bar.dataset.liked === 'true';

      bar.innerHTML = `
        <button type="button" class="pact-btn like ${isLiked ? 'liked' : ''}" onclick="togglePostLike(this)">
          ${LIKE_SVG_HTML}
          <span class="like-count" data-base="${likes}">${likes}</span>
        </button>

        <button type="button" class="pact-btn dislike" onclick="togglePostDislike(this)">
          ${DISLIKE_SVG_HTML}
          <span class="dislike-count" data-base="${dislikes}">${dislikes}</span>
        </button>

        <button type="button" class="pact-btn comment" onclick="openPostComment()">
          <svg viewBox="0 0 24 24">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/>
          </svg>
          <span>${comments}</span>
        </button>

        <button type="button" class="pact-btn share" onclick="sharePost(this)">
          <svg viewBox="0 0 24 24">
            <path d="M12 3v12M7 8l5-5 5 5"/>
            <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>
          </svg>
          <span>Share</span>
        </button>

        <div class="pact-btn views">
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>${views}</span>
        </div>
      `;
    });
  }

  function updateNumericDisplay(span, delta) {
    const base = span.dataset.base || span.innerText.trim();
    if (/^\d+$/.test(base)) {
      const next = Math.max(0, parseInt(base, 10) + delta);
      span.innerText = next;
    } else {
      span.innerText = base;
    }
  }

  function togglePostLike(btn) {
    const bar = btn.closest('.pacts');
    const countSpan = btn.querySelector('.like-count');
    const wasInitiallyLiked = bar.dataset.liked === 'true';
    const isNowLiked = !btn.classList.contains('liked');

    btn.classList.toggle('liked', isNowLiked);

    if (countSpan) {
      const baseDelta = isNowLiked ? (wasInitiallyLiked ? 0 : 1) : (wasInitiallyLiked ? -1 : 0);
      updateNumericDisplay(countSpan, baseDelta);
    }

    if (isNowLiked) {
      const dislikeBtn = bar.querySelector('.pact-btn.dislike');
      if (dislikeBtn && dislikeBtn.classList.contains('disliked')) {
        dislikeBtn.classList.remove('disliked');
        const dCount = dislikeBtn.querySelector('.dislike-count');
        if (dCount) updateNumericDisplay(dCount, 0);
      }
    }
  }

  function togglePostDislike(btn) {
    const bar = btn.closest('.pacts');
    const countSpan = btn.querySelector('.dislike-count');
    const isNowDisliked = !btn.classList.contains('disliked');

    btn.classList.toggle('disliked', isNowDisliked);

    if (countSpan) {
      updateNumericDisplay(countSpan, isNowDisliked ? 1 : 0);
    }

    if (isNowDisliked) {
      const likeBtn = bar.querySelector('.pact-btn.like');
      if (likeBtn && likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        const lCount = likeBtn.querySelector('.like-count');
        const wasInitiallyLiked = bar.dataset.liked === 'true';
        if (lCount) updateNumericDisplay(lCount, wasInitiallyLiked ? -1 : 0);
      }
    }
  }

  function openPostComment() {
    window.location.href = 'comment.html';
  }

  function sharePost(btn) {
    const post = btn.closest('.post');
    const text = post ? (post.querySelector('.ptext')?.innerText || 'Trex Wallet Post') : 'Trex Wallet Post';
    if (navigator.share) {
      navigator.share({ title: 'Trex Wallet', text: text, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard');
      });
    } else {
      showToast('Share ready');
    }
  }

  const officialMiniApps = [
    {
      name: "Hamster Kombat",
      username: "@hamster_kombat_bot",
      bio: "Tap-to-earn game & crypto exchange CEO simulator 🐹",
      avatar: "https://i.ibb.co/kVDMB446/1691a8ddce540acf22ab628d38e1a1eb.jpg",
      banner: "https://i.ibb.co/HD2LmrSs/file-000000009c208211ab0bfbe5a2b0905c.png"
    },
    {
      name: "Morpho Mining",
      username: "@MorphoMiningBot",
      bio: "Cloud mining & reward system on Telegram ⚡",
      avatar: "https://i.ibb.co/VWn0T7CN/IMG-20261109-093801-473.jpg",
      banner: "https://i.ibb.co/Kc7PXSq3/file-0000000025f88211800724d39c26b133.png"
    },
    {
      name: "Simple Coin",
      username: "@Simple_Tap_Bot",
      bio: "Simple tap & mine crypto rewards on TON 🪙",
      avatar: "https://i.ibb.co/K16MdQ3/IMG-20261108-222534-614.jpg",
      banner: "https://i.ibb.co/cS3dhMtS/file-000000001db882118f597f62d2f46ca2.png"
    },
    {
      name: "DOGS",
      username: "@dogshouse_bot",
      bio: "The most Telegram-native memecoin on TON 🐶",
      avatar: "https://i.ibb.co/SXPBJPQ8/IMG-20261109-101027-987.jpg",
      banner: "https://i.ibb.co/C5TqWZhd/file-0000000072008211a045d7a11d31c804.png"
    },
    {
      name: "Yescoin",
      username: "@theYescoin_bot",
      bio: "Swipe to earn viral Web3 crypto game on Telegram 🚀",
      avatar: "https://i.ibb.co/0jFx55ny/IMG-20261109-101102-358.jpg",
      banner: "https://i.ibb.co/n8kD6DXW/file-000000006ce88211ad134ed621a948b8.png"
    },
    {
      name: "Blum",
      username: "@BlumCryptoBot",
      bio: "Trade, farm and earn crypto inside Telegram 🌸",
      avatar: "https://i.ibb.co/GfkYZKrm/IMG-20261109-100241-571.jpg",
      banner: "https://i.ibb.co/h1gqY6J7/file-000000003e64821185ba8323487a4dcb.png"
    },
    {
      name: "TapSwap",
      username: "@tapswap_bot",
      bio: "Tap to earn decentralized crypto shares on TON 💰",
      avatar: "https://i.ibb.co/x8X1mn56/IMG-20261109-101040-793.jpg",
      banner: "https://i.ibb.co/0VWysCwv/file-000000003c148211ad9ccf62ff4d0b34.png"
    }
  ];

  function renderMiniApps() {
    const container = document.getElementById('miniAppsCards');
    if (!container) return;

    container.innerHTML = officialMiniApps.map(app => `
      <div class="card">
        <div class="banner" style="background-image: url('${app.banner}');"></div>
        <div class="body">
          <div class="mini" style="background-image: url('${app.avatar}');"></div>
          <button class="follow" onclick="startApp('${app.username}')">Start</button>
          <h3>${app.name}</h3>
          <div class="h">${app.username}</div>
          <p>${app.bio}</p>
        </div>
      </div>
    `).join('');
  }

  function startApp(username) {
    const handle = username.replace('@', '');
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${handle}`);
    } else {
      window.open(`https://t.me/${handle}`, '_blank');
    }
  }

  function switchProfileTab(tabName) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    const activeBtn = document.getElementById('tabBtn-' + tabName);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const targetContent = document.getElementById('tabContent-' + tabName);
    if (targetContent) targetContent.classList.add('active');
  }

  function calculateAge(dobString) {
    if (!dobString) return null;
    const birth = new Date(dobString);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderMiniApps();
    renderPostActions();

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram User";
        const username = user.username ? '@' + user.username : '@user';
        const uid = user.id ? String(user.id) : '00000000';

        document.getElementById('userName').textContent = fullName;
        document.getElementById('userHandle').textContent = username;
        document.getElementById('userIdText').textContent = 'User ID: #' + uid;

        if (user.photo_url) {
          document.getElementById('userAvatar')!.style.backgroundImage = `url("${user.photo_url}")`;
          document.querySelectorAll<HTMLElement>('.post-avatar').forEach(el => el.style.backgroundImage = `url("${user.photo_url}")`);
        }
        document.querySelectorAll('.feed-name').forEach(el => el.textContent = fullName);
        document.querySelectorAll('.feed-handle').forEach(el => el.textContent = username);
      }
    }

    // Load Dynamic Data from LocalStorage
    try {
      const savedProfile = JSON.parse(localStorage.getItem('trex_profile_data') || '{}');
      
      // 1. Bio
      if (savedProfile.bio) {
        document.getElementById('userBio').innerText = savedProfile.bio;
      }

      // 2. Banner
      if (savedProfile.banner) {
        document.getElementById('coverBanner').style.backgroundImage = `url("${savedProfile.banner}")`;
      }

      // 3. Age / DOB
      if (savedProfile.dob) {
        const age = calculateAge(savedProfile.dob);
        if (age !== null) {
          document.getElementById('userAgeText').innerText = `${age} years old`;
        }
      }

      // 4. Exact Website Link Clickable
      if (savedProfile.links && savedProfile.links.length > 0 && savedProfile.links[0]) {
        const primaryLink = savedProfile.links[0];
        const fullLink = /^https?:\/\//i.test(primaryLink) ? primaryLink : 'https://' + primaryLink;
        const siteEl = document.getElementById('userSite') as HTMLAnchorElement;
        const siteTextEl = document.getElementById('userSiteText')!;
        
        siteEl.href = fullLink;
        siteTextEl.innerText = primaryLink.replace(/^https?:\/\//i, '').replace(/\/$/, '');
        
        // Exact page open on click
        siteEl.onclick = function (e) {
          e.preventDefault();
          if (window.Telegram?.WebApp?.openLink) {
            window.Telegram.WebApp.openLink(fullLink);
          } else {
            window.open(fullLink, '_blank');
          }
        };
      }
    } catch (err) {}
  });

  function navigateRoot(path) {
    const clean = path.startsWith('/') ? path : '/' + path;
    if (window.location.protocol === 'file:') {
      window.location.href = '..' + clean;
    } else {
      window.location.href = window.location.origin + clean;
    }
  }

  function selectTab(tabKey) {
    if (tabKey === 'home') {
      navigateRoot('/index.html');
      return;
    }
    if (tabKey === 'games') {
      navigateRoot('/Games/Games.html');
      return;
    }
    if (tabKey === 'task') {
      navigateRoot('/pages/Task.html');
      return;
    }
    if (tabKey === 'feed') {
      showToast('Feed page coming soon!');
      return;
    }
    if (tabKey === 'profile') {
      navigateRoot('/Profile/profile.html');
      return;
    }
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

Object.assign(window, { renderPostActions, updateNumericDisplay, togglePostLike, togglePostDislike, openPostComment, sharePost, renderMiniApps, startApp, switchProfileTab, calculateAge, navigateRoot, selectTab, showToast });
