// doorUtils.js
// Håndterer dører og overganger mellom kart i Ona.
// DOORS-objektet definerer alle dørforbindelser i spillet.

import { MAP_REGISTRY } from "../maps/mapRegistry";

export const DOORS = {
  world: [
    { x: 97, y: 74, toMap: MAP_REGISTRY["map1"], toMapName: "ona_fyr", startPos: { x: 4, y: 6 } },
  ],
  ona_fyr: [
    { x: 4, y: 7, toMap: MAP_REGISTRY["world"], toMapName: "world", startPos: { x: 97, y: 75 } },
  ],
};

export const MAP_CONFIG = {
  world: {
    indoor: false,
  },
  ona_fyr: {
    indoor: true,
    lit: false, // mørkt inne, avhengig av lamper
  },
};

export function findDoor(x, y, mapName) {
  const doors = DOORS[mapName];
  if (!doors) return null;
  return doors.find(d => d.x === x && d.y === y) || null;
}

