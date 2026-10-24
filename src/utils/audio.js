/**
 * @file src/utils/audio.js
 * @description Web Audio API 기반 오프라인 사운드 매니저
 * 
 * [주요 역할]
 * - 외부 mp3 파일 없이 브라우저 내장 Web Audio API 주파수 합성으로 효과음 재생
 * - 버튼 클릭음(Click), 퇴근 5분 전 알림 차임벨(Chime), 퇴근 완료 팡파르(Fanfare)
 * - 음소거(Mute) 상태 제어
 */

// Web Audio API Synthesizer for offline chime sound effects

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  getAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  // Soft click / tab switch pop
  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context might be blocked before first user interaction
    }
  }

  // Clock-in / Start chime (Fresh pleasant chord)
  playClockIn() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.85);
      });
    } catch {
      // Ignored
    }
  }

  // Rest / Lunch break sound (Calm ambient chime)
  playRestChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 1.3);
      });
    } catch {
      // Ignored
    }
  }

  // 5-minute pre-alert chime (Gentle attention alert)
  playWarningChime() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [659.25, 880, 1046.5]; // E5, A5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.95);
      });
    } catch {
      // Ignored
    }
  }

  // Clock-out Celebration Fanfare
  playCelebrationFanfare() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      // Arpeggio fanfare C5, E5, G5, C6, G5, C6
      const seq = [
        { note: 523.25, t: 0.0, d: 0.2 },
        { note: 659.25, t: 0.15, d: 0.2 },
        { note: 783.99, t: 0.3, d: 0.2 },
        { note: 1046.5, t: 0.45, d: 0.5 },
        { note: 783.99, t: 0.7, d: 0.2 },
        { note: 1046.5, t: 0.9, d: 1.0 },
      ];

      seq.forEach(({ note, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, ctx.currentTime + t);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + d + 0.05);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundManager();
