// agentBehaviour.js
// Modulært behaviour-system for alle agenter i Ona.
// Hvert behaviour har en condition og en action.
// createMapAI tar en prioritert liste av behaviours og returnerer en decide-funksjon.

import { getTile, isWalkable } from "../utils/mapUtils";

// ─── Hjelpefunksjoner ────────────────────────────────────────────────────────

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function stepToward(agent, tx, ty) {
  const dx = tx - agent.x;
  const dy = ty - agent.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: agent.x + (dx > 0 ? 1 : -1), y: agent.y };
  } else {
    return { x: agent.x, y: agent.y + (dy > 0 ? 1 : -1) };
  }
}

function stepAway(agent, tx, ty) {
  const dx = tx - agent.x;
  const dy = ty - agent.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: agent.x + (dx > 0 ? -1 : 1), y: agent.y };
  } else {
    return { x: agent.x, y: agent.y + (dy > 0 ? -1 : 1) };
  }
}

function randomWalkable(agent, map, radius = 2) {
  const candidates = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = agent.x + dx;
      const ny = agent.y + dy;
      const tile = getTile(nx, ny, map);
      if (tile && isWalkable(tile)) candidates.push({ x: nx, y: ny });
    }
  }
  if (candidates.length === 0) return { x: agent.x, y: agent.y };
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ─── Byggeklosser ────────────────────────────────────────────────────────────

// Stikker av fra spilleren hvis spillerens aktive nom er høyere level
export const CAREFUL = {
  name: "CAREFUL",
  condition: (agent, ctx) =>
    ctx.playerNomLevel !== undefined &&
    ctx.playerNomLevel > agent.level + 2 &&
    distance(agent.x, agent.y, ctx.pos.x, ctx.pos.y) <= 8,
  action: (agent, ctx) => stepAway(agent, ctx.pos.x, ctx.pos.y),
};

// Stikker alltid av fra spilleren hvis den ser dem
export const COWARDLY = {
  name: "COWARDLY",
  condition: (agent, ctx) =>
    distance(agent.x, agent.y, ctx.pos.x, ctx.pos.y) <= 6,
  action: (agent, ctx) => stepAway(agent, ctx.pos.x, ctx.pos.y),
};

// Stikker av hvis det er dag
export const NOCTURNAL = {
  name: "NOCTURNAL",
  condition: (agent, ctx) => !ctx.isNight,
  action: (agent, ctx) => stepAway(agent, ctx.pos.x, ctx.pos.y),
};

// Stikker av hvis det er natt
export const DIURNAL = {
  name: "DIURNAL",
  condition: (agent, ctx) => ctx.isNight,
  action: (agent, ctx) => stepAway(agent, ctx.pos.x, ctx.pos.y),
};

// Forfølger spilleren hvis innenfor rekkevidde
export const RELENTLESS = {
  name: "RELENTLESS",
  condition: (agent, ctx) =>
    distance(agent.x, agent.y, ctx.pos.x, ctx.pos.y) <= 8,
  action: (agent, ctx) => stepToward(agent, ctx.pos.x, ctx.pos.y),
};

// Beveger seg mot nærmeste opplyste tile
export const HUNTING = {
  name: "HUNTING",
  condition: (agent, ctx) => true,
  action: (agent, ctx) => randomWalkable(agent, ctx.map, 3),
};

// Vandrer tilfeldig — alltid sann, brukes som fallback
export const WANDERING = {
  name: "WANDERING",
  condition: () => true,
  action: (agent, ctx) => randomWalkable(agent, ctx.map, 2),
};

// ─── AI-fabrikk ──────────────────────────────────────────────────────────────

export function createMapAI(...behaviours) {
  return function decide(agent, ctx) {
    for (const behaviour of behaviours) {
      if (behaviour.condition(agent, ctx)) {
        return behaviour.action(agent, ctx);
      }
    }
    return { x: agent.x, y: agent.y };
  };
}

// ─── Oppdater alle agenter ───────────────────────────────────────────────────

export function updateAgents(agents, pos, map, isNight, playerNomLevel, setAgents) {
  const ctx = { pos, map, isNight, playerNomLevel };
  setAgents(prev => prev.map(agent => {
    if (!agent.ai) return agent;
    let current = { x: agent.x, y: agent.y };
    const steps = agent.mapSpeed ?? 1;
    for (let i = 0; i < steps; i++) {
      const next = agent.ai({ ...agent, ...current }, ctx);
      current = next;
    }
    return { ...agent, x: current.x, y: current.y };
  }));
}