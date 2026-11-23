export {};

    function openCreatePost() {
      window.location.href = 'makepost.html';
    }

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

    // State Management
    const postState = {
      'monkey': { likes: 3000, dislikes: 0, liked: false, disliked: false },
      1: { likes: 4820, dislikes: 4, liked: false, disliked: false }
    };

    function getIndexedDBPosts(): Promise<any[]> {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open('TrexFeedStorage', 1);
          req.onupgradeneeded = function(e) {
            (e.target as IDBOpenDBRequest).result.createObjectStore('userPosts', { keyPath: 'id' });
          };
          req.onsuccess = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            const tx = db.transaction('userPosts', 'readonly');
            const getAll = tx.objectStore('userPosts').getAll();
            getAll.onsuccess = () => resolve(getAll.result || []);
            getAll.onerror = () => resolve([]);
          };
          req.onerror = () => resolve([]);
        } catch(e) {
          resolve([]);
        }
      });
    }

    async function loadUserPosts() {
      const container = document.getElementById('userCreatedPostsArea');
      if (!container) return;

      let customPosts = [];
      try {
        customPosts = JSON.parse(localStorage.getItem('feed_user_posts')) || [];
      } catch (e) {
        customPosts = [];
      }

      const dbPosts = await getIndexedDBPosts();
      if (dbPosts && dbPosts.length > 0) {
        const map = new Map();
        customPosts.forEach(p => map.set(p.id, p));
        dbPosts.forEach(p => map.set(p.id, p));
        customPosts = Array.from(map.values()).reverse();
      }

      container.innerHTML = '';

      customPosts.forEach(post => {
        postState[post.id] = {
          likes: post.likes || 0,
          dislikes: post.dislikes || 0,
          liked: false,
          disliked: false
        };

        const postEl = document.createElement('div');
        postEl.className = 'tweet-card';
        postEl.id = `post-${post.id}`;

        let mediaHTML = '';
        if (post.video) {
          mediaHTML = `
            <div class="tweet-media-wrap">
              <video src="${post.video}" controls playsinline preload="metadata"></video>
            </div>`;
        } else if (post.image) {
          mediaHTML = `
            <div class="tweet-media-wrap">
              <img src="${post.image}" alt="Post media">
            </div>`;
        }

        const bodyHTML = post.body ? `<div class="tweet-content-text">${escapeHtml(post.body)}</div>` : '';

        postEl.innerHTML = `
          <div class="tweet-left-avatar" style="background: #141418; border: 1px solid #262626; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffffff;">
            U
          </div>
          <div class="tweet-main-body">
            <div class="tweet-author-line">
              <div class="author-meta-names">
                <span class="author-name">${escapeHtml(post.author || 'You')}</span>
                <span class="author-handle">${escapeHtml(post.handle || '@you')}</span>
                <span class="tweet-time-dot">· ${post.time || 'Just now'}</span>
              </div>
              <button class="tweet-more-btn" onclick="showToast('Options')">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>
              </button>
            </div>
            
            <div class="tweet-post-title">${escapeHtml(post.title)}</div>
            ${bodyHTML}
            ${mediaHTML}

            <div class="x-action-bar">
              <!-- 1. Comment -->
              <button type="button" class="action-btn-item reply" onclick="handleReply('${post.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span id="commVal-${post.id}">0</span>
              </button>

              <!-- 2. Share -->
              <button type="button" class="action-btn-item share" onclick="handleShare('${escapeHtml(post.title)}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span>Share</span>
              </button>

              <!-- 3. Like -->
              <button type="button" class="action-btn-item like" id="likeBtn-${post.id}" onclick="handleLike('${post.id}')">
                ${LIKE_SVG_HTML}
                <span id="likeVal-${post.id}">0</span>
              </button>

              <!-- 4. Dislike -->
              <button type="button" class="action-btn-item dislike" id="dislikeBtn-${post.id}" onclick="handleDislike('${post.id}')">
                ${DISLIKE_SVG_HTML}
                <span id="dislikeVal-${post.id}">0</span>
              </button>

              <!-- 5. Views -->
              <div class="action-btn-item views">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>1</span>
              </div>
            </div>
          </div>
        `;
        container.appendChild(postEl);
      });
    }

    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Like Toggle (Mutually Exclusive, Comment Page Style)
    function handleLike(id) {
      const p = postState[id];
      if (!p) return;
      const likeBtn = document.getElementById(`likeBtn-${id}`);
      const likeVal = document.getElementById(`likeVal-${id}`);
      const dislikeBtn = document.getElementById(`dislikeBtn-${id}`);
      const dislikeVal = document.getElementById(`dislikeVal-${id}`);

      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;

      if (p.liked && p.disliked) {
        p.disliked = false;
        p.dislikes = Math.max(0, p.dislikes - 1);
        if (dislikeBtn) dislikeBtn.classList.remove('active');
        if (dislikeVal) dislikeVal.innerText = p.dislikes;
      }

      if (likeBtn) likeBtn.classList.toggle('active', p.liked);
      if (likeVal) {
        if (id === 'monkey') {
          likeVal.innerText = p.liked ? '3,001' : '3K';
        } else if (id === 1) {
          likeVal.innerText = p.liked ? '4,821' : '4.8K';
        } else {
          likeVal.innerText = p.likes;
        }
      }
    }

    // Dislike Toggle (Mutually Exclusive, Comment Page Style)
    function handleDislike(id) {
      const p = postState[id];
      if (!p) return;
      const likeBtn = document.getElementById(`likeBtn-${id}`);
      const likeVal = document.getElementById(`likeVal-${id}`);
      const dislikeBtn = document.getElementById(`dislikeBtn-${id}`);
      const dislikeVal = document.getElementById(`dislikeVal-${id}`);

      p.disliked = !p.disliked;
      p.dislikes += p.disliked ? 1 : -1;

      if (p.disliked && p.liked) {
        p.liked = false;
        p.likes = Math.max(0, p.likes - 1);
        if (likeBtn) likeBtn.classList.remove('active');
        if (likeVal) {
          if (id === 'monkey') likeVal.innerText = '3K';
          else if (id === 1) likeVal.innerText = '4.8K';
          else likeVal.innerText = p.likes;
        }
      }

      if (dislikeBtn) dislikeBtn.classList.toggle('active', p.disliked);
      if (dislikeVal) dislikeVal.innerText = p.dislikes;
    }

    // Comment Click
    function handleReply(id) {
      window.location.href = 'view.html';
    }

    // Share Click
    function handleShare(title) {
      if (navigator.share) {
        navigator.share({ title: title, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard');
        });
      }
    }

    function navigateRoot(path) {
      const clean = path.startsWith('/') ? path : '/' + path;
      if (window.location.protocol === 'file:') {
        window.location.href = '..' + clean;
      } else {
        window.location.href = window.location.origin + clean;
      }
    }

    let resolvedTaskPath = '/pages/Task.html';
    (function resolveTaskPath() {
      if (window.location.protocol === 'file:') return;
      ['\/pages\/Task.html', '\/pages\/task.html'].forEach(async p => {
        try {
          const r = await fetch(window.location.origin + p, { method: 'HEAD' });
          if (r.ok) resolvedTaskPath = p;
        } catch (e) {}
      });
    })();

    function selectNav(key) {
      if (key === 'feed') return;
      if (key === 'home') {
        navigateRoot('/index.html');
      } else if (key === 'games') {
        navigateRoot('/Games/Games.html');
      } else if (key === 'task') {
        navigateRoot(resolvedTaskPath);
      } else if (key === 'profile') {
        navigateRoot('/Profile/profile.html');
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toastPill');
      toast.innerText = msg;
      toast.classList.add('show');
      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    // Tap on card opens view.html
    document.getElementById('postsTimeline')!.addEventListener('click', function (e) {
      const target = e.target as Element | null;
      if (target?.closest('.action-btn-item, .tweet-more-btn, a, video')) return;
      if (target?.closest('.tweet-card')) {
        window.location.href = 'view.html';
      }
    });

    loadUserPosts();
    window.addEventListener('storage', loadUserPosts);

Object.assign(window, { openCreatePost, getIndexedDBPosts, loadUserPosts, escapeHtml, handleLike, handleDislike, handleReply, handleShare, navigateRoot, selectNav, showToast });
