import { describe, expect, it, vi } from 'vitest';
import { AudioController } from '../src/services/audioController';

function fakeAudio(src = '') {
  const audio: any = { src, currentTime: 0, pause: vi.fn(), play: vi.fn(() => Promise.resolve()), onended: null, onerror: null };
  return audio;
}

describe('AudioController', () => {
  it('does not create audio when both channels are disabled', async () => {
    const factory = vi.fn(() => fakeAudio());
    const controller = new AudioController(factory);
    await controller.playSequence('/animal.mp3', '/voice.mp3', { animalSounds: false, narratorVoice: false });
    expect(factory).not.toHaveBeenCalled();
  });

  it('plays the animal sound before the narrator voice', async () => {
    const audios: any[] = [];
    const controller = new AudioController((src) => { const audio = fakeAudio(src); audios.push(audio); return audio; });
    const pending = controller.playSequence('/animal.mp3', '/voice.mp3', { animalSounds: true, narratorVoice: true });
    expect(audios.map((audio) => audio.src)).toEqual(['/animal.mp3']);
    audios[0].onended?.();
    await Promise.resolve();
    expect(audios.map((audio) => audio.src)).toEqual(['/animal.mp3', '/voice.mp3']);
    audios[1].onended?.();
    await pending;
  });

  it('supports narrator-only playback', async () => {
    const factory = vi.fn((src: string) => fakeAudio(src));
    const controller = new AudioController(factory);
    const pending = controller.playSequence('/animal.mp3', '/voice.mp3', { animalSounds: false, narratorVoice: true });
    expect(factory).toHaveBeenCalledWith('/voice.mp3');
    const audio = factory.mock.results[0]?.value;
    audio.onended?.();
    await pending;
  });

  it('stops the previous audio when a new animal is selected', async () => {
    const audios: any[] = [];
    const controller = new AudioController((src) => { const audio = fakeAudio(src); audios.push(audio); return audio; });
    void controller.playSequence('/first.mp3', '', { animalSounds: true, narratorVoice: false });
    void controller.playSequence('/second.mp3', '', { animalSounds: true, narratorVoice: false });
    expect(audios[0].pause).toHaveBeenCalled();
    expect(audios[1].src).toBe('/second.mp3');
  });

  it('does not throw when play() rejects', async () => {
    const audio = fakeAudio('/broken.mp3');
    audio.play = vi.fn(() => Promise.reject(new Error('blocked')));
    const controller = new AudioController(() => audio);
    await expect(controller.playSequence('/broken.mp3', '', { animalSounds: true, narratorVoice: false })).resolves.toBeUndefined();
  });
});
