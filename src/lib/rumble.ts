/**
 * A short, soft earthquake rumble made with the Web Audio API (no sound file needed).
 * Only ever played in response to the user's own click, so browsers allow it.
 */
let context: AudioContext | undefined;

export function playRumble(volume = 0.3): void {
  try {
    const AudioContextClass =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    context ??= new AudioContextClass();
    const ctx = context;
    void ctx.resume();

    const duration = 1.3;
    const now = ctx.currentTime;

    // Brown noise: deep, earthy noise.
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 140;

    // A low wobble underneath.
    const tone = ctx.createOscillator();
    tone.type = "sine";
    tone.frequency.setValueAtTime(55, now);
    tone.frequency.exponentialRampToValueAtTime(32, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const toneGain = ctx.createGain();
    toneGain.gain.value = 0.35;

    noise.connect(lowpass).connect(gain);
    tone.connect(toneGain).connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    tone.start(now);
    noise.stop(now + duration);
    tone.stop(now + duration);
  } catch {
    // Sound is a bonus; ignore devices that cannot play it.
  }
}
