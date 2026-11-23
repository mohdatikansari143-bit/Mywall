var TrexCore;
(function (TrexCore) {
    function initTelegramApp(hideBackButton = false) {
        try {
            const tg = window.Telegram?.WebApp;
            let user = null;
            if (tg) {
                tg.ready();
                tg.expand();
                if (hideBackButton && tg.BackButton) {
                    tg.BackButton.hide();
                }
                if (tg.initDataUnsafe?.user) {
                    user = tg.initDataUnsafe.user;
                }
                else if (tg.initData) {
                    const params = new URLSearchParams(tg.initData);
                    const userStr = params.get('user');
                    if (userStr) {
                        try {
                            user = JSON.parse(userStr);
                        }
                        catch {
                            // ignore malformed user JSON
                        }
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
                        catch {
                            // ignore malformed query user JSON
                        }
                    }
                }
            }
            return user;
        }
        catch {
            return null;
        }
    }
    TrexCore.initTelegramApp = initTelegramApp;
    function navigateRoot(path) {
        const clean = path.startsWith('/') ? path : '/' + path;
        if (window.location.protocol === 'file:') {
            window.location.href = clean.substring(1);
        }
        else {
            window.location.href = window.location.origin + clean;
        }
    }
    TrexCore.navigateRoot = navigateRoot;
    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        }
        catch {
            return fallback;
        }
    }
    TrexCore.readJson = readJson;
    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            // ignore storage quota errors
        }
    }
    TrexCore.writeJson = writeJson;
})(TrexCore || (TrexCore = {}));
