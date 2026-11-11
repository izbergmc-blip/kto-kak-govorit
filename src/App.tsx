import { useEffect, useRef, useState } from 'react';
import { Settings, PawPrint, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const carouselRef = useRef<HTMLElement>(null);
  const { play, stop } = useAudio();
  useEffect(() => { saveSettings(settings); }, [settings]);
  const selectAnimal = (animal: Animal) => { setActiveId(animal.id); play(animal, settings); };
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, animals.length - 1));
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: next * carousel.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setCurrentIndex(next);
    setActiveId(null);
    stop();
  };
  const onCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const next = Math.max(0, Math.min(Math.round(carousel.scrollLeft / carousel.clientWidth), animals.length - 1));
    if (next !== currentIndex) {
      setCurrentIndex(next);
      setActiveId(null);
      stop();
    }
  };
  const closePanels = () => { setSettingsOpen(false); setAboutOpen(false); };
  const openAbout = () => { setSettingsOpen(false); setAboutOpen(true); };
  return <main className="app-shell">
    <header className="app-header">
      <div className="brand-mark"><PawPrint size={22} strokeWidth={2.6} /></div>
      <div className="heading-copy"><h1>Кто как говорит?</h1><p>Листай и нажимай на животное</p></div>
      <button className="icon-button settings-button" onClick={() => { stop(); setActiveId(null); setSettingsOpen(true); }} aria-label="Открыть настройки"><Settings size={23} /></button>
    </header>
    <section className="animal-carousel" ref={carouselRef} onScroll={onCarouselScroll} onKeyDown={(event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    }} tabIndex={0} role="region" aria-roledescription="карусель" aria-label="Карточки животных">
      {animals.map((animal, index) => <div className="animal-slide" role="group" aria-roledescription="карточка" aria-label={`${index + 1} из ${animals.length}: ${animal.name}`} key={animal.id}>
        <AnimalCard animal={animal} active={activeId === animal.id} onSelect={selectAnimal} />
      </div>)}
    </section>
    <nav className="carousel-controls" aria-label="Перелистывание животных">
      <button className="carousel-arrow" type="button" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="Предыдущее животное"><ChevronLeft size={27} /></button>
      <div className="carousel-position"><span aria-live="polite">{currentIndex + 1} / {animals.length}</span><div className="carousel-dots" aria-hidden="true">{animals.map((animal, index) => <i key={animal.id} className={index === currentIndex ? 'is-current' : ''} />)}</div></div>
      <button className="carousel-arrow" type="button" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === animals.length - 1} aria-label="Следующее животное"><ChevronRight size={27} /></button>
    </nav>
    {settingsOpen && <SettingsPanel settings={settings} onChange={setSettings} onClose={closePanels} onAbout={openAbout} />}
    {aboutOpen && <AccessibleDialog titleId="about-title" className="about-panel" onClose={() => setAboutOpen(false)}><div className="panel-heading"><h2 id="about-title">Кто как говорит?</h2><button className="icon-button close-button" onClick={() => setAboutOpen(false)} aria-label="Закрыть">×</button></div><p>Небольшая игра для знакомства с животными и их голосами.</p><p className="settings-note">Лучше играть вместе со взрослым. Приложение не оценивает и не диагностирует развитие речи.</p></AccessibleDialog>}
  </main>;
}
