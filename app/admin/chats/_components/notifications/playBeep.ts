/**
 * Beep sutil generado en runtime con Web Audio API.
 * Sin archivos externos, sin licencias, predecible.
 *
 * Suena como un "ding" corto: 880Hz por 80ms con fade out.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (audioCtx) return audioCtx;
    const Ctor = (window.AudioContext ??
        (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
}

export function playBeep(volume: number = 0.15): void {
    const ctx = getCtx();
    if (!ctx) return;

    // Algunos browsers suspenden el AudioContext hasta que hay user interaction
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
}
