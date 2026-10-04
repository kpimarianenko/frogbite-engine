export class AudioPlayback {
  private readonly source: AudioBufferSourceNode;

  constructor(source: AudioBufferSourceNode) {
    this.source = source;
  }

  stop(): void {
    this.source.stop();
  }
}
