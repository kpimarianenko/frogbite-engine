import { AudioPlayback } from './audio-playback';

export type AudioPlayOptions = {
  volume?: number;
  loop?: boolean;
};

export class AudioManager {
  private readonly context = new AudioContext();

  play(buffer: AudioBuffer, options: AudioPlayOptions = {}): AudioPlayback {
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    source.loop = options.loop ?? false;
    gainNode.gain.value = options.volume ?? 1;

    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    source.start();

    return new AudioPlayback(source);
  }
}
