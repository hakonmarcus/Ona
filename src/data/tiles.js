export const TILES = {
  "#": {
    char: "#",
    color: "#555",
    walkable: false,
    light: 0,
  },
  ".": {
    char: ".",
    color: "#111111",
    walkable: true,
    light: 0,
  },
  "+": {
    char: "+",
    color: "#444",
    walkable: true,
    light: 0,
  },
  "D": {
    char: "D",
    color: "#e3b341",
    walkable: true,
    light: 0,
  },
  "◉": {
    char: "◉",
    color: "#fff6cc",
    walkable: false,
    light: 7,
  },
  "○": {
    char: "○",
    color: "#fff6cc",
    walkable: false,
    light: 6,
  },

  // Havet
    "~": {
    char: "~",
    color: "#1a6b9a",  // dypt vann, mørk blå
    walkable: false,
    light: 0,
  },
  "≈": {
    char: "≈",
    color: "#4db8e8",  // bølge, lysere blå
    walkable: false,
    light: 0,
  },
  "░": {
    char: "░",
    color: "#a8e4f7",  // skum mot land, nesten hvit
    walkable: false,
    light: 0,
  },
  "─": { char: "─", color: "#666", walkable: false, light: 0 },
  "│": { char: "│", color: "#666", walkable: false, light: 0 },
  "┌": { char: "┌", color: "#666", walkable: false, light: 0 },
  "┐": { char: "┐", color: "#666", walkable: false, light: 0 },
  "└": { char: "└", color: "#666", walkable: false, light: 0 },
  "┘": { char: "┘", color: "#666", walkable: false, light: 0 },
  "├": { char: "├", color: "#666", walkable: false, light: 0 },
  "┤": { char: "┤", color: "#666", walkable: false, light: 0 },
  "┬": { char: "┬", color: "#666", walkable: false, light: 0 },
  "┴": { char: "┴", color: "#666", walkable: false, light: 0 },
  "┼": { char: "┼", color: "#666", walkable: false, light: 0 },
  "═": { char: "═", color: "#666", walkable: false, light: 0 },
  "║": { char: "║", color: "#666", walkable: false, light: 0 },
  "╔": { char: "╔", color: "#666", walkable: false, light: 0 },
  "╗": { char: "╗", color: "#666", walkable: false, light: 0 },
  "╚": { char: "╚", color: "#666", walkable: false, light: 0 },
  "╝": { char: "╝", color: "#666", walkable: false, light: 0 },
  "╠": { char: "╠", color: "#666", walkable: false, light: 0 },
  "╣": { char: "╣", color: "#666", walkable: false, light: 0 },
  "╦": { char: "╦", color: "#666", walkable: false, light: 0 },
  "╩": { char: "╩", color: "#666", walkable: false, light: 0 },
  "╬": { char: "╬", color: "#666", walkable: false, light: 0 },
  "╱": { char: "╱", color: "#666", walkable: false, light: 0 },
  "╳": { char: "╳", color: "#666", walkable: false, light: 0 },
  "╲": { char: "╲", color: "#666", walkable: false, light: 0 },
  "H": { char: "H", color: "#682f15", walkable: false, light: 0 },
  "%": { char: "%", color: "#156839", walkable: false, light: 0 },
  "◫": { char: "%", color: "#aaa", walkable: false, light: 0 }
  

};

export function getTileData(char) {
  return TILES[char] ?? TILES["."];
}