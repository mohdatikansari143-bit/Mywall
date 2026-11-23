interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramBackButton {
  isVisible?: boolean;
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick?: (cb: () => void) => void;
}

interface TelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged?: () => void;
}

interface TelegramMainButton {
  show: () => void;
  hide: () => void;
  setText: (text: string) => void;
  onClick: (cb: () => void) => void;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close?: () => void;
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    start_param?: string;
  };
  BackButton?: TelegramBackButton;
  MainButton?: TelegramMainButton;
  HapticFeedback?: TelegramHapticFeedback;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
}

declare var Telegram: {
  WebApp?: TelegramWebApp;
};

declare var google: any;
declare var TON_CONNECT_UI: any;

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
  [key: string]: any;
}

interface ReferralEntry {
  id: number | string;
  name: string;
  username?: string;
  photo_url?: string;
  date?: string;
}

interface WithdrawRecord {
  id: string;
  actionBadge: string;
  status: 'completed' | 'pending' | 'incomplete';
  statusTitle: string;
  balanceFormatted: string;
  typeText: string;
  exactTimestamp: string;
  orderNumber: string;
  remarks: string;
}

interface ProfileData {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  links?: string[];
}
