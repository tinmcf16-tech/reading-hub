// Self-contained Web Audio API chime & sound feedback engine
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or suspended
    }
  }

  // Gentle correct chime (high positive major chord)
  playCorrect() {
    this.playTone(523.25, 'triangle', 0.15, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.25), 200); // G5
  }

  // Gentle encouragement tone
  playTryAgain() {
    this.playTone(392.00, 'sine', 0.15, 0.15); // G4
    setTimeout(() => this.playTone(329.63, 'sine', 0.25, 0.15), 120); // E4
  }

  // Victory fanfare for completing modules or scoring 100%
  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.25), i * 140);
    });
  }

  // Speech synthesis for read-aloud
  speak(text, lang = 'en-US') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Child-friendly slightly slower rate
      utterance.pitch = 1.1; // Friendly warm pitch
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sounds = new SoundEffects();
