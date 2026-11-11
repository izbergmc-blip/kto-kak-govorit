import type { SoundSettings } from '../types';

export const SETTINGS_STORAGE_KEY = 'kto-kak-govorit-settings-v1';
export const DEFAULT_SETTINGS: SoundSettings = { animalSounds: true, narratorVoice: true };

export function loadSettings(storage?: Pick<Storage, 'getItem'>): SoundSettings {
  try {
    const target = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
    const raw = target?.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SoundSettings>;
    return { animalSounds: parsed.animalSounds !== false, narratorVoice: parsed.narratorVoice !== false };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: SoundSettings, storage?: Pick<Storage, 'setItem'>): void {
  try {
    const target = storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
    target?.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable in private browsing or embedded WebViews.
  }
}
