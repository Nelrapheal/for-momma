// Web Audio API Ambient Romantic Music & Sound FX Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmTimer: number | null = null;

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore audio init errors on unsupported mobile browsers
    }
  }

  public toggleMute(): boolean {
    try {
      this.initContext();
      this.isMuted = !this.isMuted;
      
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(
          this.isMuted ? 0.0001 : 0.25,
          now + 0.8
        );
      }

      if (!this.isMuted && !this.isPlaying) {
        this.startAmbientMusic();
      }
    } catch {
      // Ignore mobile audio exception
    }

    return !this.isMuted;
  }

  public startAmbientMusic() {
    this.initContext();
    if (this.isPlaying || !this.ctx || !this.masterGain) return;
    this.isPlaying = true;
    this.isMuted = false;

    // Romantic Arpeggiated Piano / Pad Chord Progression in F Major / D Minor
    // Fmaj7 (F, A, C, E) -> Dm9 (D, F, A, C, E) -> Bbmaj7 (Bb, D, F, A) -> C11 (C, G, Bb, D, E)
    const chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7 / A
      [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
      [116.54, 146.83, 174.61, 220.00, 261.63], // Bbmaj7
      [130.81, 164.81, 196.00, 233.08, 293.66], // C11
    ];

    let chordIdx = 0;

    const playChordSequence = () => {
      try {
        if (!this.ctx || !this.isPlaying || this.isMuted) return;

        const currentChord = chords[chordIdx];
        const now = this.ctx.currentTime;

        // Play soft pad background note
        currentChord.slice(0, 3).forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq / 2; // Low warm octave pad

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.03, now + 2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 8);
        });

        // Arpeggiate piano-like chime notes over 8 seconds
        currentChord.forEach((freq, i) => {
          const noteTime = now + i * 1.2 + (Math.random() * 0.3);
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          // Triangle wave gives a soft electric piano / kalimba timbre
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.5);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(noteTime);
          osc.stop(noteTime + 3.8);
        });

        chordIdx = (chordIdx + 1) % chords.length;
      } catch {
        // Ignore chord sequence exception on mobile
      }
    };

    playChordSequence();
    this.bgmTimer = window.setInterval(playChordSequence, 7000);
  }

  public playBloomSound() {
    // Disabled click sound effects per user preference
    return;
  }

  public playSealBreakSound() {
    // Disabled click sound effects per user preference
    return;
  }

  public playClickSound() {
    // Disabled click sound effects per user preference
    return;
  }

  public playErrorSound() {
    // Disabled click sound effects per user preference
    return;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new AudioEngine();
