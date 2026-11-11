import type { SoundSettings } from '../types';

export type AudioFactory = (src: string) => HTMLAudioElement;
export class AudioController {
  private current: HTMLAudioElement | null = null;
  private sequence = 0;
  private cancelCurrent: (() => void) | null = null;
  constructor(private readonly createAudio: AudioFactory = (src) => new Audio(src)) {}

  stop() {
    this.sequence += 1;
    this.cancelCurrent?.();
    this.cancelCurrent = null;
    if (this.current) {
      this.current.onended = null;
      this.current.onerror = null;
      this.current.pause();
      try { this.current.currentTime = 0; } catch { /* Some WebViews can reject seeking before metadata. */ }
      this.current = null;
    }
  }

  async playSequence(animalSrc: string, voiceSrc: string, settings: SoundSettings) {
    this.stop();
    const token = this.sequence;
    const files = [settings.animalSounds ? animalSrc : '', settings.narratorVoice ? voiceSrc : ''].filter(Boolean);
    for (const src of files) {
      if (token !== this.sequence) return;
      const audio = this.createAudio(src);
      this.current = audio;
      const finished = await new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (ok: boolean) => { if (settled) return; settled = true; if (this.cancelCurrent === cancel) this.cancelCurrent = null; resolve(ok); };
        const cancel = () => finish(false);
        this.cancelCurrent = cancel;
        audio.onended = () => finish(true);
        audio.onerror = () => finish(false);
        try {
          const result = audio.play();
          if (result && typeof result.catch === 'function') result.catch(() => finish(false));
        } catch { finish(false); }
      });
      if (token !== this.sequence) return;
      if (this.current === audio) this.current = null;
      if (!finished) continue;
    }
  }
}
