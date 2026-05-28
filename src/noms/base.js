// base.js
// Basisegenskaper for alle agenter og noms i Ona.

export const BASE_AGENT = {
  x: 0,
  y: 0,
  visible: true,
};

export const BASE_NOM = {
  ...BASE_AGENT,
  level: 1,
  hp: null,
  mp: null,
};