namespace TrexCore {
  export function initTelegramApp(hideBackButton = false): TelegramUser | null {
    try {
      const tg = window.Telegram?.WebApp;
      let user: TelegramUser | null = null;

      if (tg) {
        tg.ready();
        tg.expand();
        if (hideBackButton && tg.BackButton) {
          tg.BackButton.hide();
        }
        if (tg.initDataUnsafe?.user) {
          user = tg.initDataUnsafe.user;
        } else if (tg.initData) {
          const params = new URLSearchParams(tg.initData);
          const userStr = params.get('user');
          if (userStr) {
            try {
              user = JSON.parse(userStr) as TelegramUser;
            } catch {
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
              user = JSON.parse(uStr) as TelegramUser;
            } catch {
              // ignore malformed query user JSON
            }
          }
        }
      }

      return user;
    } catch {
      return null;
    }
  }

  export function navigateRoot(path: string): void {
    const clean = path.startsWith('/') ? path : '/' + path;
    if (window.location.protocol === 'file:') {
      window.location.href = clean.substring(1);
    } else {
      window.location.href = window.location.origin + clean;
    }
  }

  export function readJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  export function writeJson<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage quota errors
    }
  }
}
