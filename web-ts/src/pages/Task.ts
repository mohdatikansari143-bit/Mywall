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

    // ==========================================
    // BULLETPROOF ROOT NAVIGATION (YEHI HAI WO FUNCTION)
    // ==========================================
    function navTo(path) {
      const clean = path.startsWith('/') ? path : '/' + path;
      window.location.href = window.location.origin + clean;
    }

    // ============================================================
    // AD LINK
    // ============================================================
    const AD_URL = 'https://example.com/your-ad-link';

    function openAd() {
      window.open(AD_URL, '_blank');
    }

    const toast = document.getElementById('toastPill');
    let toastTimer = null;

    function showToast(msg) {
      if (!toast) return;
      toast.innerText = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }

    function loadBalance() {
      let storedBalance = localStorage.getItem('trex_user_balance');
      if (storedBalance === null) {
        storedBalance = "2845.50";
        localStorage.setItem('trex_user_balance', storedBalance);
      }
      return parseFloat(storedBalance);
    }

    function addBalance(amount, taskName) {
      let current = loadBalance();
      current += amount;
      localStorage.setItem('trex_user_balance', current.toFixed(2));
      showToast(`+${amount} TR Credited! (${taskName})`);
    }

    window.addEventListener('pageshow', loadBalance);
    document.addEventListener('DOMContentLoaded', loadBalance);

    const checkmarkHtml = `
      <div class="check-completed-pill">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        DONE
      </div>
    `;

    function switchPage(pageKey) {
      document.getElementById('tabDailyBtn').classList.toggle('active', pageKey === 'daily');
      document.getElementById('tabWeeklyBtn').classList.toggle('active', pageKey === 'weekly');
      document.getElementById('tabChannelsBtn').classList.toggle('active', pageKey === 'channels');

      document.getElementById('pageDaily').classList.toggle('active', pageKey === 'daily');
      document.getElementById('pageWeekly').classList.toggle('active', pageKey === 'weekly');
      document.getElementById('pageChannels').classList.toggle('active', pageKey === 'channels');
    }

    // Watch 4 Ads Logic
    let adsWatched = 0;
    const adActionWrap = document.getElementById('adTaskActionWrap');
    const adsTitle = document.getElementById('adsTitleText');

    function progressAdTask() {
      openAd();
      adsWatched++;
      if (adsWatched < 4) {
        adActionWrap.innerHTML = `
          <button class="btn-task-start" onclick="progressAdTask()">START (${adsWatched}/4)</button>
        `;
        showToast(`Ad ${adsWatched}/4 Watched!`);
      } else {
        adActionWrap.innerHTML = checkmarkHtml;
        adsTitle.innerText = "Watch 4 Ads (Completed)";
        addBalance(100, "4 Ads Reward");
      }
    }

    function completeStandardTask(elementId, rewardAmount, taskName) {
      openAd();
      const container = document.getElementById(elementId);
      container.innerHTML = `
        <button class="btn-task-start" style="opacity: 0.7;">WORKING...</button>
      `;
      setTimeout(() => {
        container.innerHTML = checkmarkHtml;
        addBalance(rewardAmount, taskName);
      }, 700);
    }

    function completeChannelTask(elementId, rewardAmount, channelName) {
      openAd();
      const container = document.getElementById(elementId);
      container.innerHTML = `
        <button class="btn-task-join" style="opacity: 0.7;">JOINING...</button>
      `;
      setTimeout(() => {
        container.innerHTML = checkmarkHtml;
        addBalance(rewardAmount, channelName);
      }, 800);
    }

    // ===== Real-time Week Strip (Mon - Sun) =====
    function renderWeekStrip() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const offset = (today.getDay() + 6) % 7;
      const monday = new Date(today);
      monday.setDate(today.getDate() - offset);

      const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let html = '';
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const isToday = d.getTime() === today.getTime();
        html += `
          <div class="week-day ${isToday ? 'today' : ''}">
            <div class="week-dot"></div>
            <div class="week-name">${names[i]}</div>
            <div class="week-date">${d.getDate()}</div>
          </div>`;
      }
      document.getElementById('weekStrip').innerHTML = html;
    }

    function scheduleMidnightUpdate() {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      setTimeout(() => {
        renderWeekStrip();
        scheduleMidnightUpdate();
      }, next.getTime() - now.getTime());
    }

    renderWeekStrip();
    scheduleMidnightUpdate();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) renderWeekStrip();
    });
    window.addEventListener('pageshow', renderWeekStrip);

Object.assign(window, { navTo, openAd, showToast, loadBalance, addBalance, switchPage, progressAdTask, completeStandardTask, completeChannelTask, renderWeekStrip, scheduleMidnightUpdate });
