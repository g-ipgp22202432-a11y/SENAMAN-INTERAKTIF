/**
 * Procedural Web Audio API Sound Engine & BoBoiBoy Music Synthesizer
 * Composes the iconic BoBoiBoy theme song motif ("BoBoiBoy Superhero Kita!"),
 * Elemental power rhythms, Tok Aba Kokotiam cartoon vibes, and supports
 * custom teacher MP3 background audio files.
 * Strictly NO human voiceovers as requested ("Pastikan tiada suara orang bercakap hanya teks sahaja").
 */

import { MusicTrackId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private tempo: number = 135; // BPM - Ideal for Year 5 PE Cardio Warm-up
  private currentStep: number = 0;
  private timerId: number | null = null;

  private currentTrack: MusicTrackId = 'BOBOIBOY_OST_OFFICIAL';
  private officialAudio: HTMLAudioElement | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customFileName: string | null = null;

  constructor() {
    // AudioContext and audio elements will be initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.28;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initOfficialAudio() {
    if (!this.officialAudio && typeof window !== 'undefined') {
      const audio = new Audio('/assets/aistudio/BoBoiBoy_OST__Main_Theme_Instrumental_2fb0155a.mp3');
      audio.loop = true;
      audio.volume = this.isMuted ? 0 : 0.65;
      audio.preload = 'auto';
      this.officialAudio = audio;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGain && this.sfxGain) {
      this.musicGain.gain.value = muted ? 0 : 0.28;
      this.sfxGain.gain.value = muted ? 0 : 0.35;
    }
    if (this.officialAudio) {
      this.officialAudio.muted = muted;
      this.officialAudio.volume = muted ? 0 : 0.65;
    }
    if (this.customAudio) {
      this.customAudio.muted = muted;
      this.customAudio.volume = muted ? 0 : 0.65;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setTempo(bpm: number) {
    this.tempo = Math.max(90, Math.min(160, bpm));
    if (this.officialAudio) {
      // Dynamic tempo adjustment for Year 5 PE warm-up phases (135 BPM is standard 1.0x)
      const rate = Math.max(0.85, Math.min(1.2, bpm / 135));
      this.officialAudio.playbackRate = rate;
    }
  }

  public setMusicTrack(track: MusicTrackId) {
    this.currentTrack = track;
    if (track !== 'BOBOIBOY_OST_OFFICIAL' && this.officialAudio) {
      this.officialAudio.pause();
    }
    if (track !== 'CUSTOM_FILE' && this.customAudio) {
      this.customAudio.pause();
    }
    if (this.isMusicPlaying) {
      if (track === 'BOBOIBOY_OST_OFFICIAL') {
        this.initOfficialAudio();
        this.officialAudio?.play().catch(() => {});
      } else if (track === 'CUSTOM_FILE' && this.customAudio) {
        this.customAudio.play().catch(() => {});
      } else {
        this.currentStep = 0;
        this.scheduleBeat();
      }
    }
  }

  public getMusicTrack(): MusicTrackId {
    return this.currentTrack;
  }

  public getCustomFileName(): string | null {
    return this.customFileName;
  }

  /**
   * Load custom BoBoiBoy MP3/WAV audio file uploaded by teacher
   */
  public async loadCustomAudioFile(file: File): Promise<string> {
    const url = URL.createObjectURL(file);
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.isMuted ? 0 : 0.65;
    this.customAudio = audio;
    this.customFileName = file.name;
    this.currentTrack = 'CUSTOM_FILE';

    if (this.isMusicPlaying) {
      if (this.officialAudio) {
        this.officialAudio.pause();
      }
      await audio.play().catch(() => {});
    }

    return file.name;
  }

  public startMusic() {
    this.initCtx();
    this.initOfficialAudio();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    if (this.currentTrack === 'BOBOIBOY_OST_OFFICIAL') {
      if (this.officialAudio) {
        this.officialAudio.muted = this.isMuted;
        this.officialAudio.volume = this.isMuted ? 0 : 0.65;
        this.officialAudio.play().catch(() => {});
      }
      return;
    }

    if (this.currentTrack === 'CUSTOM_FILE' && this.customAudio) {
      this.customAudio.currentTime = 0;
      this.customAudio.play().catch(() => {});
      return;
    }

    this.currentStep = 0;
    this.scheduleBeat();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.officialAudio) {
      this.officialAudio.pause();
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public restartMusic() {
    if (this.officialAudio) {
      this.officialAudio.currentTime = 0;
    }
    if (this.customAudio) {
      this.customAudio.currentTime = 0;
    }
    this.currentStep = 0;
  }

  public pauseMusic() {
    this.stopMusic();
  }

  public resumeMusic() {
    if (this.isMusicPlaying) return;
    this.startMusic();
  }

  /**
   * Main procedural beat scheduler for BoBoiBoy soundtrack themes
   */
  private scheduleBeat = () => {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
    if (this.currentTrack === 'BOBOIBOY_OST_OFFICIAL' || this.currentTrack === 'CUSTOM_FILE') return;

    const time = this.ctx.currentTime + 0.04;

    if (this.currentTrack === 'BOBOIBOY_HERO') {
      this.playBoBoiBoyHeroStep(time, this.currentStep % 64);
    } else if (this.currentTrack === 'BOBOIBOY_ELEMENTAL') {
      this.playBoBoiBoyElementalStep(time, this.currentStep % 32);
    } else {
      this.playKokotiamSantaiStep(time, this.currentStep % 32);
    }

    this.currentStep++;
    const stepDurationMs = (60 / this.tempo / 4) * 1000;
    this.timerId = window.setTimeout(this.scheduleBeat, stepDurationMs);
  };

  /**
   * THEME 1: "BoBoiBoy Superhero Kita!" - 64-step Epic Heroic Cartoon Arrangement
   * Progression: C - Am - F - G (The iconic energetic hero chord progression)
   */
  private playBoBoiBoyHeroStep(time: number, step: number) {
    // 1. Kick Drum (Steady 4-on-the-floor cardio drive for jogging in place)
    if (step % 4 === 0) {
      this.playKick(time);
    }

    // 2. Snare / Claps (Rock backbeat on beats 4, 12, 20, 28... with double roll on climax 62, 63)
    if (step % 8 === 4 || step === 30 || step === 31 || step === 62 || step === 63) {
      this.playSnare(time, step >= 62);
    }

    // 3. Hi-hats (Upbeat 16th note rhythm)
    if (step % 2 === 0) {
      this.playHiHat(time, step % 4 === 2);
    }

    // 4. Heroic BoBoiBoy Bassline (C3: 130.81, A2: 110, F2: 87.31, G2: 98.00)
    let chordBass = 130.81; // C3
    if (step >= 16 && step < 32) chordBass = 110.00; // A2 (Am)
    else if (step >= 32 && step < 48) chordBass = 87.31; // F2 (F)
    else if (step >= 48) chordBass = 98.00; // G2 (G)

    // Bass rhythm: root - octave bounce
    if (step % 4 === 0) {
      this.playBassNote(chordBass, time, 0.22);
    } else if (step % 4 === 2) {
      this.playBassNote(chordBass * 2, time, 0.15); // Octave slap
    } else if (step % 8 === 7) {
      this.playBassNote(chordBass * 1.5, time, 0.12); // Fifth transition
    }

    // 5. ICONIC BOBOIBOY THEME MELODY ("Bo-Boi-Boy! Superhero Kita!")
    // Frequencies (Hz): C5=523.25, D5=587.33, E5=659.25, F5=698.46, G5=783.99, A5=880.00, B5=987.77, C6=1046.50
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;
    const G5 = 783.99;
    const A5 = 880.00;
    const B5 = 987.77;
    const C6 = 1046.50;
    const D6 = 1174.66;
    const A4 = 440.00;
    const G4 = 392.00;

    // Phrase 1 (0-15): "Bo-Boi-Boy! Superhero Kita!"
    if (step === 0) this.playHeroBrass(C5, time, 0.18, 0.24); // Bo-
    else if (step === 2) this.playHeroBrass(C5, time, 0.18, 0.24); // -Boi-
    else if (step === 4) this.playHeroBrass(C5, time, 0.32, 0.30); // -Boy!
    else if (step === 6) this.playHeroBrass(D5, time, 0.14, 0.22); // Su-
    else if (step === 7) this.playHeroBrass(E5, time, 0.15, 0.24); // -per-
    else if (step === 8) this.playHeroBrass(D5, time, 0.22, 0.26); // -he-
    else if (step === 10) this.playHeroBrass(C5, time, 0.22, 0.26); // -ro
    else if (step === 12) this.playHeroBrass(A4, time, 0.20, 0.22); // ki-
    else if (step === 14) this.playHeroBrass(C5, time, 0.32, 0.28); // -ta!

    // Phrase 2 (16-31): "Dengan Kuasa Elemental... Petir, Api, Angin!"
    else if (step === 16) this.playHeroBrass(E5, time, 0.20, 0.24); // Kua-
    else if (step === 18) this.playHeroBrass(G5, time, 0.20, 0.26); // -sa-
    else if (step === 20) this.playHeroBrass(A5, time, 0.30, 0.30); // -nya!
    else if (step === 22) this.playHeroBrass(G5, time, 0.20, 0.24);
    else if (step === 24) this.playHeroBrass(E5, time, 0.20, 0.25); // Bo-
    else if (step === 26) this.playHeroBrass(G5, time, 0.20, 0.26); // -Boi-
    else if (step === 28) this.playHeroBrass(A5, time, 0.25, 0.30); // -Boy!
    else if (step === 30) this.playHeroBrass(C6, time, 0.40, 0.34); // TERBAIK! (High C6 punch)

    // Phrase 3 (32-47): Driving Heroic Fanfare
    else if (step === 32) this.playHeroBrass(A4, time, 0.20, 0.22);
    else if (step === 34) this.playHeroBrass(C5, time, 0.20, 0.24);
    else if (step === 36) this.playHeroBrass(D5, time, 0.20, 0.26);
    else if (step === 38) this.playHeroBrass(E5, time, 0.28, 0.28);
    else if (step === 40) this.playHeroBrass(G5, time, 0.24, 0.28);
    else if (step === 42) this.playHeroBrass(E5, time, 0.20, 0.24);
    else if (step === 44) this.playHeroBrass(D5, time, 0.20, 0.22);
    else if (step === 46) this.playHeroBrass(C5, time, 0.28, 0.26);

    // Phrase 4 (48-63): Climax crescendo to loop
    else if (step === 48) this.playHeroBrass(C5, time, 0.18, 0.24);
    else if (step === 50) this.playHeroBrass(D5, time, 0.18, 0.24);
    else if (step === 52) this.playHeroBrass(E5, time, 0.22, 0.26);
    else if (step === 54) this.playHeroBrass(G5, time, 0.24, 0.28);
    else if (step === 56) this.playHeroBrass(A5, time, 0.28, 0.30);
    else if (step === 58) this.playHeroBrass(C6, time, 0.30, 0.34);
    else if (step === 60) this.playHeroBrass(D6, time, 0.25, 0.35);
    else if (step === 62) this.playHeroBrass(C6, time, 0.45, 0.36); // Soaring final hold

    // 6. Sparkle Arpeggio Plucks (Adds cartoon high-energy sparkle)
    if (step % 2 === 1) {
      const arpNotes = [C5, E5, G5, C6];
      const arpNote = arpNotes[(step / 2 | 0) % arpNotes.length];
      this.playArpSparkle(arpNote, time);
    }
  }

  /**
   * THEME 2: "BoBoiBoy Elemental Rush" - High-speed heroic techno-rock for Phase 3 Pecutan
   */
  private playBoBoiBoyElementalStep(time: number, step: number) {
    if (step % 4 === 0) this.playKick(time);
    if (step % 8 === 4) this.playSnare(time, false);
    this.playHiHat(time, step % 2 === 1);

    const bassNotes = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 110];
    this.playBassNote(bassNotes[step % 8], time, 0.14);

    const elementalRiff = [
      880, 0, 1046.5, 0, 1174.66, 1318.51, 1174.66, 0,
      1046.5, 0, 880, 783.99, 880, 0, 1046.5, 1174.66,
    ];
    const n = elementalRiff[step % 16];
    if (n > 0) {
      this.playHeroBrass(n, time, 0.12, 0.26);
    }
  }

  /**
   * THEME 3: "Santai Kokotiam Tok Aba" - Cheerful bouncy cartoon groove for Warmup & Cooldown
   */
  private playKokotiamSantaiStep(time: number, step: number) {
    if (step % 4 === 0) this.playKick(time);
    if (step % 8 === 4) this.playSnare(time, false);
    if (step % 2 === 0) this.playHiHat(time, step % 4 === 2);

    // Warm marimba-like bass bounce
    const roots = [130.81, 174.61, 196.00, 130.81];
    const root = roots[(step / 8) | 0];
    if (step % 4 === 0) this.playBassNote(root, time, 0.22);
    else if (step % 4 === 2) this.playBassNote(root * 1.5, time, 0.16);

    // Sweet cartoon melody
    const santaiNotes = [
      523.25, 0, 659.25, 0, 783.99, 880.00, 783.99, 0,
      659.25, 0, 587.33, 0, 523.25, 587.33, 659.25, 783.99,
    ];
    const note = santaiNotes[step % 16];
    if (note > 0) {
      this.playSynthLead(note, time);
    }
  }

  // --- Instrument Synthesizers ---

  /**
   * Brassy Superhero Lead (Dual detuned sawtooth oscillators with resonant lowpass filter)
   * Mimics the classic BoBoiBoy animated theme lead melody
   */
  private playHeroBrass(freq: number, time: number, duration: number, volume: number = 0.25) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    // Slight chorus detune
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.006, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 4.5, 9000), time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.8, time + duration);
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.02);
    osc2.stop(time + duration + 0.02);
  }

  /**
   * Sparkly Arpeggio Plucks
   */
  private playArpSparkle(freq: number, time: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playKick(time: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.11);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playSnare(time: number, isRoll: boolean = false) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * (isRoll ? 0.06 : 0.12);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1100, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isRoll ? 0.22 : 0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isRoll ? 0.07 : 0.13));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + (isRoll ? 0.08 : 0.14));
  }

  private playHiHat(time: number, accent: boolean) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8500, time);

    gain.gain.setValueAtTime(accent ? 0.11 : 0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playBassNote(freq: number, time: number, duration: number = 0.2) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, time);
    filter.frequency.exponentialRampToValueAtTime(250, time + duration);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playSynthLead(freq: number, time: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.14, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.13);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  // --- Physical Action & Warm-up SFX ---

  public playWhistleCue() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const time = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(28, time); // 28Hz rapid pea whistle flutter
    lfoGain.gain.setValueAtTime(80, time);

    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    osc1.frequency.setValueAtTime(2400, time);
    osc2.frequency.setValueAtTime(2780, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(time);
    osc1.start(time);
    osc2.start(time);

    lfo.stop(time + 0.36);
    osc1.stop(time + 0.36);
    osc2.stop(time + 0.36);
  }

  public playJumpSfx() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(750, time + 0.22);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.26);
  }

  public playDuckSfx() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.2);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.24);
  }

  public playStepSfx() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, time);
    osc.frequency.exponentialRampToValueAtTime(520, time + 0.08);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.11);
  }

  public playSuccessChime() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const time = this.ctx.currentTime;

    [1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.05);

      gain.gain.setValueAtTime(0.18, time + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time + idx * 0.05);
      osc.stop(time + idx * 0.05 + 0.2);
    });
  }

  public playCelebrationFanfare() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const time = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time + i * 0.12);

      gain.gain.setValueAtTime(0.25, time + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time + i * 0.12);
      osc.stop(time + i * 0.12 + 0.45);
    });
  }
}

export const soundEngine = new SoundEngine();
