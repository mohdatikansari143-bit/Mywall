export {};

    // Bulletproof Back Button Logic
    function goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '../index.html';
      }
    }

    // ========================================================
    // DYNAMIC BOT REFERRAL LINK WITH TELEGRAM USER ID & SECURITY
    // ========================================================
    const BOT_BASE_URL = "https://t.me/Trexwalletcombot/Trexwallet";
    let currentUserId = null;
    let refLink = BOT_BASE_URL;
    let shareMessage = "";

    (function initReferralSystem() {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.ready();
          tg.expand();
          if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            currentUserId = tg.initDataUnsafe.user.id;
          } else if (tg.initData) {
            const params = new URLSearchParams(tg.initData);
            const userStr = params.get('user');
            if (userStr) {
              try { currentUserId = JSON.parse(userStr).id; } catch (e) {}
            }
          }

          // Anti-Fraud check: Block self-referral
          const startParam = tg.initDataUnsafe?.start_param;
          if (startParam && currentUserId && String(startParam) === String(currentUserId)) {
            console.warn("Anti-Cheat: Self-referral attempt blocked.");
          }
        }

        if (!currentUserId) {
          const urlParams = new URLSearchParams(window.location.search);
          const tgData = urlParams.get('tgWebAppData');
          if (tgData) {
            const innerParams = new URLSearchParams(tgData);
            const uStr = innerParams.get('user');
            if (uStr) {
              try { currentUserId = JSON.parse(uStr).id; } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error("User detection error:", err);
      }

      if (!currentUserId) {
        currentUserId = "882947102";
      }

      refLink = `${BOT_BASE_URL}?startapp=${currentUserId}`;
      shareMessage = `Join Trex Mining with my referral link and get 150 TRX free reward! Start here: ${refLink}`;

      const linkEl = document.getElementById("refLinkText");
      if (linkEl) {
        linkEl.textContent = refLink;
      }

      // Load and Sync Real-Time Referrals
      syncAndRenderReferrals();
    })();

    // ========================================================
    // REAL-TIME CLOUD & LOCAL SYNC "MY REFERRALS" RENDERING
    // ========================================================
    async function syncAndRenderReferrals() {
      let storedRefs = JSON.parse(localStorage.getItem('my_trex_referrals') || '[]');

      // Fetch cloud incoming referrals from other devices
      if (currentUserId) {
        try {
          const res = await fetch(`https://ntfy.sh/trex_referral_${currentUserId}/json?poll=1`);
          if (res.ok) {
            const text = await res.text();
            if (text.trim()) {
              const lines = text.trim().split('\n');
              let hasNew = false;
              for (const line of lines) {
                try {
                  const item = JSON.parse(line);
                  if (item.event === 'message' && item.message) {
                    const uObj = JSON.parse(item.message);
                    if (!storedRefs.some(r => String(r.id) === String(uObj.id))) {
                      storedRefs.unshift(uObj);
                      hasNew = true;
                    }
                  }
                } catch (e) {}
              }
              if (hasNew) {
                localStorage.setItem('my_trex_referrals', JSON.stringify(storedRefs));
              }
            }
          }
        } catch (e) {}
      }

      const container = document.getElementById('realtimeRefList');
      const emptyState = document.getElementById('emptyRefState');
      const countBadge = document.getElementById('myRefCount');
      const counterEl = document.getElementById('referralCounter');
      const earnedEl = document.getElementById('totalEarnedTRX');

      const count = storedRefs.length;
      if (countBadge) countBadge.textContent = count;
      if (counterEl) counterEl.textContent = count;
      if (earnedEl) earnedEl.textContent = (count * 150).toLocaleString('en-US') + ' TRX';

      if (!container) return;

      if (count === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        container.innerHTML = '';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        container.innerHTML = storedRefs.map((user, idx) => `
          <div class="my-ref-row">
            <div class="my-ref-left">
              <span class="my-ref-rank">#${idx + 1}</span>
              <div class="my-ref-avatar">
                <img src="${user.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=1a1a24&color=fff&bold=true`}" alt="${user.name}">
              </div>
              <div class="my-ref-meta">
                <span class="my-ref-name">${user.username ? '@' + user.username : (user.name || 'Miner')}</span>
                <span class="my-ref-time">${user.date || 'Active Node'}</span>
              </div>
            </div>
            <span class="my-ref-earn">+150 TRX</span>
          </div>
        `).join('');
      }
    }

    function openInNewTab(url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Share Handler for all 15 platforms
    function shareTo(platform) {
      const encUrl = encodeURIComponent(refLink);
      const encText = encodeURIComponent(shareMessage);
      let target = "";

      switch (platform) {
        case 'whatsapp':
          target = `https://api.whatsapp.com/send?text=${encText}`;
          break;
        case 'telegram':
          target = `https://t.me/share/url?url=${encUrl}&text=${encText}`;
          break;
        case 'facebook':
          target = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
          break;
        case 'snapchat':
          target = `https://www.snapchat.com/share?link=${encUrl}`;
          break;
        case 'gmail':
          target = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Invite%20to%20TrexMining&body=${encText}`;
          break;
        case 'messages':
          window.location.href = `sms:?body=${encText}`;
          return;
        case 'pinterest':
          target = `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${encText}`;
          break;
        case 'reddit':
          target = `https://reddit.com/submit?url=${encUrl}&title=${encodeURIComponent("Claim 150 TRX Free Reward on Trex Mining!")}`;
          break;
        case 'x':
          target = `https://twitter.com/intent/tweet?text=${encText}`;
          break;
        case 'threads':
          target = `https://threads.net/intent/post?text=${encText}`;
          break;
        case 'linkedin':
          target = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
          break;
        case 'tumblr':
          target = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encUrl}&caption=${encText}`;
          break;
        case 'bereal':
          copyRefLink();
          showToast("Link copied! Opening BeReal...");
          setTimeout(() => openInNewTab('https://bereal.com/'), 350);
          return;
        case 'discord':
          copyRefLink();
          showToast("Link copied! Opening Discord...");
          setTimeout(() => openInNewTab('https://discord.com/app'), 350);
          return;
        case 'instagram':
          copyRefLink();
          showToast("Link copied! Opening Instagram...");
          setTimeout(() => openInNewTab('https://www.instagram.com/'), 350);
          return;
      }

      if (target) {
        openInNewTab(target);
      }
    }

    // Direct Telegram Share Button
    function shareToTelegram() {
      const encUrl = encodeURIComponent(refLink);
      const encText = encodeURIComponent(shareMessage);
      openInNewTab(`https://t.me/share/url?url=${encUrl}&text=${encText}`);
    }

    // Copy Referral Link
    function copyRefLink() {
      navigator.clipboard.writeText(refLink).then(() => {
        showToast("Referral link copied!");
      }).catch(() => {
        showToast("Link: " + refLink);
      });
    }

    // Toast Alert
    function showToast(text) {
      const toast = document.getElementById('toastBox');
      toast.innerText = text;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }

Object.assign(window, { goBack, syncAndRenderReferrals, openInNewTab, shareTo, shareToTelegram, copyRefLink, showToast });
