/** Trigger haptic feedback if the Vibration API is available. */
export function haptic(style: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const durations = { light: 8, medium: 15, heavy: 25 };
  try { navigator.vibrate(durations[style]); } catch {}
}

/** Double-pulse haptic for confirmations */
export function hapticSuccess() {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try { navigator.vibrate([10, 40, 10]); } catch {}
}
