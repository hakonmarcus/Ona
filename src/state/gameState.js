// gameState.js
// Spilltilstand som nullstilles ved hver loop i Ona.
// Inneholder tid, dag/natt-syklus og andre flyktige spillverdier.

export const MINUTES_PER_TICK = 5;
export const DAY_START = 6 * 60;   // 06:00
export const NIGHT_START = 18 * 60; // 18:00
export const MINUTES_PER_DAY = 24 * 60;
export const TICKS_PER_DAY = MINUTES_PER_DAY / MINUTES_PER_TICK; // 288
export const LOOP_DAYS = 3;
export const TICKS_PER_LOOP = TICKS_PER_DAY * LOOP_DAYS; // 864

export function getTwilightFactor(tick) {
  const { minuteOfDay } = getTimeInfoRaw(tick);
  const dawnStart = DAY_START;        // 360 min (06:00)
  const dawnEnd = DAY_START + 60;     // 420 min (07:00)
  const duskStart = NIGHT_START;      // 1080 min (18:00)
  const duskEnd = NIGHT_START + 60;   // 1140 min (19:00)

  if (minuteOfDay >= dawnEnd && minuteOfDay < duskStart) return 0; // full dag
  if (minuteOfDay >= duskEnd || minuteOfDay < dawnStart) return 1; // full natt

  if (minuteOfDay >= duskStart && minuteOfDay < duskEnd) {
    return (minuteOfDay - duskStart) / 60; // 0→1 solnedgang
  }
  if (minuteOfDay >= dawnStart && minuteOfDay < dawnEnd) {
    return 1 - (minuteOfDay - dawnStart) / 60; // 1→0 daggry
  }
  return 0;
}

function getTimeInfoRaw(tick) {
  const totalMinutes = DAY_START + tick * MINUTES_PER_TICK;
  const minuteOfDay = totalMinutes % MINUTES_PER_DAY;
  return { minuteOfDay };
}

export function getTimeInfo(tick) {
  const totalMinutes = DAY_START + tick * MINUTES_PER_TICK;
  const minuteOfDay = totalMinutes % MINUTES_PER_DAY;
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const day = Math.floor(totalMinutes / MINUTES_PER_DAY) + 1;
  const isNight = minuteOfDay < DAY_START || minuteOfDay >= NIGHT_START;
  const timeStr = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");

  return { isNight, day, hour, minute, timeStr, minuteOfDay };
}

