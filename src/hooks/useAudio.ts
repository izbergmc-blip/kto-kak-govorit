import { useEffect, useRef } from 'react';
import { AudioController } from '../services/audioController';
import type { Animal, SoundSettings } from '../types';

export function useAudio() {
  const controller = useRef<AudioController | null>(null);
  if (!controller.current) controller.current = new AudioController();
  useEffect(() => {
    const stop = () => controller.current?.stop();
    const onVisibility = () => { if (document.visibilityState === 'hidden') stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', stop);
    return () => { document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', stop); stop(); };
  }, []);
  const play = (animal: Animal, settings: SoundSettings) => {
    const animalPath = `${import.meta.env.BASE_URL}${animal.animalAudio.replace(/^\//, '')}`;
    const voicePath = `${import.meta.env.BASE_URL}${animal.voiceAudio.replace(/^\//, '')}`;
    void controller.current?.playSequence(animalPath, voicePath, settings);
  };
  const stop = () => controller.current?.stop();
  return { play, stop };
}
