import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, SETTINGS_STORAGE_KEY } from '../src/services/settingsStorage';

describe('settingsStorage', () => {
  it('returns safe defaults when storage is empty', () => {
    const storage = { getItem: () => null };
    expect(loadSettings(storage)).toEqual(DEFAULT_SETTINGS);
  });
  it('loads independently persisted channel settings', () => {
    const storage = { getItem: (key: string) => key === SETTINGS_STORAGE_KEY ? '{"animalSounds":false,"narratorVoice":true}' : null };
    expect(loadSettings(storage)).toEqual({ animalSounds: false, narratorVoice: true });
  });
  it('saves settings as JSON', () => {
    let stored = '';
    const storage = { setItem: (_key: string, value: string) => { stored = value; } };
    saveSettings({ animalSounds: true, narratorVoice: false }, storage);
    expect(JSON.parse(stored)).toEqual({ animalSounds: true, narratorVoice: false });
  });
});
