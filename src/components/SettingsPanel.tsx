import type { SoundSettings } from '../types';
import { AccessibleDialog } from './AccessibleDialog';
type Props = { settings: SoundSettings; onChange: (next: SoundSettings) => void; onClose: () => void; onAbout: () => void };
export function SettingsPanel({ settings, onChange, onClose, onAbout }: Props) {
  return <AccessibleDialog titleId="settings-title" onClose={onClose}>
      <div className="panel-heading"><h2 id="settings-title">Настройки</h2><button className="icon-button close-button" onClick={onClose} aria-label="Закрыть">×</button></div>
      <label className="setting-row"><span className="setting-icon">♫</span><span>Звуки животных</span><input type="checkbox" checked={settings.animalSounds} onChange={(e) => onChange({ ...settings, animalSounds: e.target.checked })} /></label>
      <label className="setting-row"><span className="setting-icon">◖</span><span>Голос диктора</span><input type="checkbox" checked={settings.narratorVoice} onChange={(e) => onChange({ ...settings, narratorVoice: e.target.checked })} /></label>
      <button className="about-row" onClick={onAbout}>ⓘ　О приложении <span>›</span></button>
      <p className="settings-note">Настройки сохраняются на этом устройстве.</p>
  </AccessibleDialog>;
}
