// mapUtils.js
// Hjelpefunksjoner for kartsystemet i Ona.
// Håndterer kartlogikk som nabosjekkr, tile-egenskaper og posisjonsvalidering.

import { getTileData } from "../data/tiles.js";


export function isNextToCoast(x, y, map) {
  const neighbors = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  return neighbors.some(([nx, ny]) => {
    const row = map[ny];
    return row && row[nx] === "+";
  });
}


export function isWalkable(char) {
  return getTileData(char).walkable;
}

export function isValidPosition(x, y, map) {
  return map[y] !== undefined && map[y][x] !== undefined;
}

export function getTile(x, y, map) {
  if (!isValidPosition(x, y, map)) return null;
  return map[y][x];
}

export function getVisibility(mapX, mapY, pos, twilight, map, flicker, frame) {
  const skyLight = 1 - twilight;

  const lampLight = getLampVisibility(mapX, mapY, map, flicker, frame);

  const dx = mapX - pos.x;
  const dy = mapY - pos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  let playerLight = 0;
  if (skyLight < 1) {
    if (dist <= 3) playerLight = 1;
    else if (dist <= 4) playerLight = 0.5;
  }

  return Math.min(1, skyLight + playerLight + lampLight);
}

export const LAMP_RADIUS = 8; // juster etter ønske

export function getLampVisibility(mapX, mapY, map, flicker, frame) {
  let best = 0;
  for (let dy = -8; dy <= 8; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      const nx = mapX + dx;
      const ny = mapY + dy;
      const row = map[ny];
      if (!row) continue;
      if (row[nx] !== "◉") continue;
      const lampFlicker = flicker && Math.random() < 0.2;
      const radius = (frame % 4 < 2) ? 6 : 7;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius - 1) best = Math.max(best, 1);
      else if (dist <= radius) best = Math.max(best, 0.5);
    }
  }
  return best;
}