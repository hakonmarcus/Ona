// mapRegistry.js
// Laster automatisk inn alle kart i maps/-mappen.
// Bare lag en ny .js-fil i mappen, så dukker den opp i editoren.

const context = require.context("./", false, /\.js$/);

export const MAP_REGISTRY = {};

context.keys().forEach(key => {
  if (key === "./mapRegistry.js") return;
  const name = key.replace("./", "").replace(".js", "");
  MAP_REGISTRY[name] = context(key).default;
});