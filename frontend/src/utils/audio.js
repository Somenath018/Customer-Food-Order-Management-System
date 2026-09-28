class SoundEngine {
  constructor() {
    this.muted = false;
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }

  // Play pleasant chime on new incoming order
  playOrderPlaced() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two-tone bell chime
      [
        { freq: 523.25, time: 0, duration: 0.18 }, // C5
        { freq: 659.25, time: 0.12, duration: 0.18 }, // E5
        { freq: 783.99, time: 0.24, duration: 0.35 }  // G5
      ].forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.18, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Play upbeat alert when order is ready or delivered
  playSuccessChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [
        { freq: 587.33, time: 0, duration: 0.12 }, // D5
        { freq: 880.00, time: 0.10, duration: 0.25 }  // A5
      ].forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.15, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Kitchen chime for restaurant receiving a new order
  playKitchenAlert() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [
        { freq: 880, time: 0, duration: 0.15 },
        { freq: 1174.66, time: 0.15, duration: 0.15 },
        { freq: 1318.51, time: 0.30, duration: 0.35 }
      ].forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.2, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  // Double chime alert for new incoming delivery task
  playNewTaskChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.38);
      gain2.gain.setValueAtTime(0.35, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const sound = new SoundEngine();
export const soundEngine = sound;
export default sound;
