// 001hellbat.js
// Hellbat – et flaksende flaggermusvesen fra underverdenen.
// Dualtype: hellspawn / beast

import { BASE_NOM } from "./base";
import { createMapAI, CAREFUL, RELENTLESS, HUNTING, WANDERING } from "./agentBehaviour";


export const hellbatStats = {
  baseHp:  40,
  baseAtk: 60,
  baseDef: 30,
  baseSpd: 80,
  baseSPR: 30,  // spell resistance
  baseSPP: 20,  // spell power
};

export const hellbatMoves = [
  { name: "Swipe", power: 40, learnedAt: 1 },
  { name: "Dive",  power: 60, learnedAt: 8 },
];

export const hellbatLeveling = {
  evolvesAt: null,
  evolvesInto: null,
};

export function createHellbat(x, y) {
  return {
    ...BASE_NOM,
    id: crypto.randomUUID(),
    nomNumber: 1,
    name: "Hellbat",
    type: ["hellspawn", "beast"],
    symbol: ">",
    altSymbol: "—",
    color: "#8B2020",
    x, y,
    ...hellbatStats,
    moves: hellbatMoves,
    mapSpeed: 2,
    leveling: hellbatLeveling,
    dormant: false,
    dormantTicks: 0,
    ai: createMapAI(CAREFUL, RELENTLESS, HUNTING, WANDERING),
  };
}