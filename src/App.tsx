import { useEffect, useState } from 'react';
import { Settings, Volume2, PawPrint } from 'lucide-react';
import { animals } from './data/animals';
import { AnimalCard } from './components/AnimalCard';
import { SettingsPanel } from './components/SettingsPanel';
import { AccessibleDialog } from './components/AccessibleDialog';
import { useAudio } from './hooks/useAudio';
import { useTelegram } from './hooks/useTelegram';
import type { Animal } from './types';
import { loadSettings, saveSettings } from './services/settingsStorage';
export default function App() {
  useTelegram();
  const [settings, setSettings] = useState(loadSettings);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { play, stop } = useAudio();
  useEffect(() => { saveSettings(settings); }, [settings]);
  const selectAnimal = (animal: Animal) => { setActiveId(animal.id); play(animal, settings); };
  const closePanels = () => { setSettingsOpen(false); setAboutOpen(false); };
  const openAbout = () => { setSettingsOpen(false); setAboutOpen(true); };
  return <main className="app-shell">
    <header className="app-header">
      <div className="brand-mark"><PawPrint size={22} strokeWidth={2.6} /></div>
      <div className="heading-copy"><h1>Кто как говорит?</h1><p>Нажми на животное и послушай!</p></div>
      <button className="icon-button settings-button" onClick={() => { stop(); setActiveId(null); setSettingsOpen(true); }} aria-label="Открыть настройки"><Settings size={23} /></button>
    </header>
    <section className="animal-grid" aria-label="Выбери животное">
      {animals.map((animal) => <AnimalCard key={animal.id} animal={animal} active={activeId === animal.id} onSelect={selectAnimal} />)}
    </section>
    <footer className="app-footer"><Volume2 size={15} /> Играйте и повторяйте вместе</footer>
    {settingsOpen && <SettingsPanel settings={settings} onChange={setSettings} onClose={closePanels} onAbout={openAbout} />}
    {aboutOpen && <AccessibleDialog titleId="about-title" className="about-panel" onClose={() => setAboutOpen(false)}><div className="panel-heading"><h2 id="about-title">Кто как говорит?</h2><button className="icon-button close-button" onClick={() => setAboutOpen(false)} aria-label="Закрыть">×</button></div><p>Небольшая игра для знакомства с животными и их голосами.</p><p className="settings-note">Лучше играть вместе со взрослым. Приложение не оценивает и не диагностирует развитие речи.</p></AccessibleDialog>}
  </main>;
}
