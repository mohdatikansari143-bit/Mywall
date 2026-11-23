let currentUserId = null;
// Auto-detect Telegram User & Hide BackButton on Home
(function initTelegramUser() {
    try {
        const tg = window.Telegram?.WebApp;
        let user = null;
        if (tg) {
            tg.ready();
            tg.expand();
            if (tg.BackButton)
                tg.BackButton.hide();
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                user = tg.initDataUnsafe.user;
            }
            else if (tg.initData) {
                const params = new URLSearchParams(tg.initData);
                const userStr = params.get('user');
                if (userStr) {
                    try {
                        user = JSON.parse(userStr);
                    }
                    catch (e) { }
                }
            }
        }
        if (!user) {
            const urlParams = new URLSearchParams(window.location.search);
            const tgData = urlParams.get('tgWebAppData');
            if (tgData) {
                const innerParams = new URLSearchParams(tgData);
                const uStr = innerParams.get('user');
                if (uStr) {
                    try {
                        user = JSON.parse(uStr);
                    }
                    catch (e) { }
                }
            }
        }
        const nameEl = document.getElementById('userName');
        const idEl = document.getElementById('userId');
        const avatarEl = document.getElementById('userAvatar');
        if (user) {
            currentUserId = user.id;
            const tgUsername = user.username
                ? '@' + user.username
                : ([user.first_name, user.last_name].filter(Boolean).join(' ') || 'User');
            if (nameEl)
                nameEl.textContent = tgUsername;
            if (idEl)
                idEl.textContent = 'ID: #' + user.id;
            if (avatarEl) {
                if (user.photo_url) {
                    avatarEl.src = user.photo_url;
                }
                else {
                    const letter = (user.username || user.first_name || 'U').charAt(0).toUpperCase();
                    avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=18181f&color=ffffff&bold=true&size=128`;
                }
            }
            let inviterId = tg?.initDataUnsafe?.start_param;
            if (!inviterId) {
                const urlParams = new URLSearchParams(window.location.search);
                inviterId = urlParams.get('startapp') || urlParams.get('ref');
            }
            if (inviterId && String(inviterId) !== String(user.id)) {
                const sentKey = 'registered_ref_to_' + inviterId;
                if (!localStorage.getItem(sentKey)) {
                    fetch('https://ntfy.sh/trex_referral_' + inviterId, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: user.id,
                            name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Miner',
                            username: user.username || '',
                            photo_url: user.photo_url || '',
                            date: 'Just now'
                        })
                    }).then(() => {
                        localStorage.setItem(sentKey, 'true');
                        showToast('Welcome bonus +50 TRX activated!');
                    }).catch(() => { });
                }
            }
        }
    }
    catch (e) {
        console.error("Telegram WebApp detection error:", e);
    }
})();
// Auto-resolve Post/feed.html & Tap.html paths quietly
let resolvedFeedPath = '/Post/feed.html';
let resolvedTapPath = '/pages/Tap.html';
let resolvedTaskPath = '/pages/Task.html';
(function resolveAppPaths() {
    if (window.location.protocol === 'file:')
        return;
    const checkFirst = async (candidates, setter) => {
        for (const p of candidates) {
            try {
                const r = await fetch(window.location.origin + p, { method: 'HEAD' });
                if (r.ok) {
                    setter(p);
                    return;
                }
            }
            catch (e) { }
        }
    };
    checkFirst(['/Post/feed.html', '/post/feed.html', '/Feed/feed.html', '/feed/feed.html'], p => { resolvedFeedPath = p; });
    checkFirst(['/pages/Tap.html', '/pages/tap.html'], p => { resolvedTapPath = p; });
    checkFirst(['/pages/Task.html', '/pages/task.html'], p => { resolvedTaskPath = p; });
})();
// Real-Time Home Balance
let isBalanceHidden = false;
let actualBalanceString = '0 TRX';
let totalComputedBalance = 0;
async function syncAndCalculateHomeMetrics() {
    try {
        let storedRefs = JSON.parse(localStorage.getItem('my_trex_referrals') || '[]');
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
                            }
                            catch (e) { }
                        }
                        if (hasNew) {
                            localStorage.setItem('my_trex_referrals', JSON.stringify(storedRefs));
                        }
                    }
                }
            }
            catch (e) { }
        }
        const count = storedRefs.length;
        totalComputedBalance = count * 150;
        actualBalanceString = totalComputedBalance.toLocaleString('en-US') + ' TRX';
        const balanceText = document.getElementById('homeBalance');
        if (balanceText && !isBalanceHidden) {
            balanceText.textContent = actualBalanceString;
        }
        const percent = Math.min(100, Math.floor(count / 3));
        const valEl = document.getElementById('referPercentVal');
        const ringEl = document.getElementById('referRing');
        if (valEl)
            valEl.textContent = String(percent);
        if (ringEl) {
            const fullCircumference = 106.8;
            const offset = fullCircumference - (fullCircumference * (percent / 100));
            ringEl.style.strokeDashoffset = offset.toFixed(1);
        }
    }
    catch (err) {
        console.error("Metrics sync error:", err);
    }
}
syncAndCalculateHomeMetrics();
// Fast History Back (bfcache) restoration
window.addEventListener('pageshow', function () {
    if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
    }
    syncAndCalculateHomeMetrics();
});
window.addEventListener('storage', syncAndCalculateHomeMetrics);
// Root Navigation Logic (Preserves History for Fast Back Navigation)
function navigateRoot(path) {
    const clean = path.startsWith('/') ? path : '/' + path;
    if (window.location.protocol === 'file:') {
        window.location.href = clean.substring(1);
    }
    else {
        window.location.href = window.location.origin + clean;
    }
}
function openReferralPage() {
    navigateRoot('/Profile/reffer.html');
}
const toastEl = document.getElementById('toastPill');
let toastTimer = null;
function showToast(msg) {
    if (!toastEl)
        return;
    toastEl.innerText = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
function selectTab(tabKey) {
    if (tabKey === 'home') {
        return;
    }
    if (tabKey === 'games') {
        navigateRoot('/Games/Games.html');
        return;
    }
    if (tabKey === 'task') {
        navigateRoot(resolvedTaskPath);
        return;
    }
    if (tabKey === 'feed') {
        navigateRoot(resolvedFeedPath);
        return;
    }
    if (tabKey === 'profile') {
        navigateRoot('/Profile/profile.html');
        return;
    }
}
function openNotifications() {
    navigateRoot('/pages/Notification.html');
}
function handleAction(type) {
    if (type === 'withdraw') {
        navigateRoot('/pages/withdraw.html');
    }
    else if (type === 'history') {
        navigateRoot('/pages/Withdraw%20history.html');
    }
    else if (type === 'leaderboard') {
        navigateRoot('/pages/leaderboard.html');
    }
    else if (type === 'tap') {
        navigateRoot(resolvedTapPath);
    }
}
function toggleBalanceVisibility(event) {
    if (event)
        event.stopPropagation();
    isBalanceHidden = !isBalanceHidden;
    const balText = document.getElementById('homeBalance');
    const eyeOpen = document.getElementById('eyeOpenIcon');
    const eyeClose = document.getElementById('eyeCloseIcon');
    if (isBalanceHidden) {
        if (balText)
            balText.textContent = '••••••••';
        if (eyeOpen)
            eyeOpen.style.display = 'none';
        if (eyeClose)
            eyeClose.style.display = 'block';
    }
    else {
        if (balText)
            balText.textContent = actualBalanceString;
        if (eyeOpen)
            eyeOpen.style.display = 'block';
        if (eyeClose)
            eyeClose.style.display = 'none';
    }
}
let isRefreshing = false;
function triggerRefresh() {
    if (isRefreshing)
        return;
    isRefreshing = true;
    const refreshBtn = document.getElementById('refreshBtn');
    const balanceText = document.getElementById('homeBalance');
    refreshBtn.classList.add('spinning');
    syncAndCalculateHomeMetrics().then(() => {
        const target = totalComputedBalance;
        const duration = 850;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const current = Math.round(target * ease);
            actualBalanceString = current.toLocaleString('en-US') + ' TRX';
            if (!isBalanceHidden && balanceText) {
                balanceText.textContent = actualBalanceString;
            }
            if (p < 1) {
                requestAnimationFrame(step);
            }
            else {
                actualBalanceString = target.toLocaleString('en-US') + ' TRX';
                if (!isBalanceHidden && balanceText) {
                    balanceText.textContent = actualBalanceString;
                }
                refreshBtn.classList.remove('spinning');
                isRefreshing = false;
            }
        }
        requestAnimationFrame(step);
    });
}
Object.assign(window, { syncAndCalculateHomeMetrics, navigateRoot, openReferralPage, showToast, selectTab, openNotifications, handleAction, toggleBalanceVisibility, triggerRefresh });
export {};
