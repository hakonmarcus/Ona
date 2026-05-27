// MapRenderer.jsx
// Komponent som håndterer tegning av kartet i Ona.
// Beregner viewport og tegner tiles med riktige farger og symboler.

import { isNextToCoast, getVisibility } from "../utils/mapUtils";
import { getTileData } from "../data/tiles";



const VIEW_W = 40;
const VIEW_H = 25;

export default function MapRenderer({ currentMap, pos, frame, twilight, flicker}) {
  const mapWidth = currentMap[0].length;
  const mapHeight = currentMap.length;

  const viewW = Math.min(VIEW_W, mapWidth);
  const viewH = Math.min(VIEW_H, mapHeight);

  const startX = Math.max(0, Math.min(pos.x - Math.floor(viewW / 2), mapWidth - viewW));
  const startY = Math.max(0, Math.min(pos.y - Math.floor(viewH / 2), mapHeight - viewH));

  return (
    <div>
      {currentMap.slice(startY, startY + viewH).map((row, screenY) => {
        const mapY = startY + screenY;
        return (

          <div key={screenY} style={{ display: "flex" }}>
            {row.slice(startX, startX + viewW).split("").map((tile, screenX) => {
              const mapX = startX + screenX;
              const isPlayer = mapX === pos.x && mapY === pos.y;
              const isWater = tile === "~";
              const isWave = isWater && (mapX + mapY - frame) % 6 === 0;
              const isFoam = isWave && isNextToCoast(mapX, mapY, currentMap);

              const visibility = getVisibility(mapX, mapY, pos, twilight, currentMap, flicker, frame);
              const lampFlicker = flicker && Math.random() < 0.2;
              const animatedChar = tile === "◉"
                ? (lampFlicker ? "○" : "◉")
                : isWater
                ? (isFoam ? "░" : isWave ? "≈" : "~")
                : tile;

              const tileData = getTileData(animatedChar);
              const color = isPlayer ? "#55cc55" : tileData.color;

              return (
                <span key={screenX} style={{ color, opacity: visibility }}>
                  {isPlayer ? "@" : animatedChar}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}