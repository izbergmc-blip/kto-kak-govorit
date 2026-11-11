import { useEffect } from 'react';

type TelegramWebApp = { ready?: () => void; expand?: () => void; disableVerticalSwipes?: () => void; isExpanded?: boolean };
declare global { interface Window { Telegram?: { WebApp?: TelegramWebApp } } }
export function useTelegram() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    try { webApp?.ready?.(); webApp?.expand?.(); webApp?.disableVerticalSwipes?.(); } catch { /* Keep browser fallback fully functional. */ }
  }, []);
}
