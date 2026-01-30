// Sound effects using Web Audio API for instant playback
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Generate a pleasant "ding" sound for correct answers
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant ascending tone
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    oscillator.type = 'sine';

    // Quick fade in and out
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Silently fail if audio isn't available
    console.debug('Audio not available:', e);
  }
}

// Generate a "buzzer" sound for wrong answers
export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Low buzzer tone
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.setValueAtTime(120, ctx.currentTime + 0.15);

    oscillator.type = 'sawtooth';

    // Quick attack, sustain, decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 0.25);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Silently fail if audio isn't available
    console.debug('Audio not available:', e);
  }
}

// Celebratory sound for game completion
export function playVictorySound(): void {
  try {
    const ctx = getAudioContext();

    // Play a quick ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.12;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  } catch (e) {
    console.debug('Audio not available:', e);
  }
}
