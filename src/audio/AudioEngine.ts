// Web Audio API Ambient Romantic Music & Sound FX Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
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
          this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
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
          this.isMuted ? 0.0001 : 0.35,
          now + 0.3
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
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = false;
    try {
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    } catch {
      // Ignore gain set error
    }

    // Ensure suspended context is resumed on mobile interaction
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    
    // If already running, just ensure unmuted and resumed
    if (this.isPlaying) return;
    this.isPlaying = true;

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
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }

        const currentChord = chords[chordIdx];
        const now = this.ctx.currentTime;

        // Play soft pad background note with warm fade-in
        currentChord.slice(0, 3).forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq / 2; // Low warm octave pad

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 5.8);
        });

        // Arpeggiate piano-like chime notes
        currentChord.forEach((freq, i) => {
          const noteTime = now + 0.05 + i * 0.35;
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.2);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(noteTime);
          osc.stop(noteTime + 3.4);
        });

        chordIdx = (chordIdx + 1) % chords.length;
      } catch {
        // Ignore chord sequence exception on mobile
      }
    };

    playChordSequence();
    if (this.bgmTimer) window.clearInterval(this.bgmTimer);
    this.bgmTimer = window.setInterval(playChordSequence, 5500);
  }

  public playBloomSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 1.3);
      });
    } catch {
      // Ignore mobile audio exception
    }
  }

  public playSealBreakSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Ignore mobile audio exception
    }
  }

  public playClickSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 587.33; // D5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore mobile audio exception
    }
  }

  public playErrorSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 196.00; // G3 soft low tone
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore mobile audio exception
    }
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    try {
      this.initContext();
      this.isMuted = muted;
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(
          this.isMuted ? 0.0001 : 0.35,
          now + 0.3
        );
      }
    } catch {
      // Ignore mobile audio exception
    }
  }
}

export const audioEngine = new AudioEngine();

