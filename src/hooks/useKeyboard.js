// useKeyboard.js
// Custom hook som håndterer all tastaturinput i Ona.
// Lytter på piltaster og oppdaterer spillerposisjon og karttilstand.

import { useEffect } from "react";
import { isWalkable, getTile } from "../utils/mapUtils";
import { findDoor } from "../utils/doorUtils";

export default function useKeyboard(
  currentMapRef,
  currentMapNameRef,
  setPos,
  setCurrentMap,
  setCurrentMapName,
  setPendingPos,
  setTick
) {
  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      setPos(prev => {
        let next;
        switch (e.key) {
          case "ArrowUp":    next = { ...prev, y: prev.y - 1 }; break;
          case "ArrowDown":  next = { ...prev, y: prev.y + 1 }; break;
          case "ArrowLeft":  next = { ...prev, x: prev.x - 1 }; break;
          case "ArrowRight": next = { ...prev, x: prev.x + 1 }; break;
          default:           return prev;
        }

        const tile = getTile(next.x, next.y, currentMapRef.current);

        if (!tile) return prev;
        if (!isWalkable(tile)) return prev;

        if (tile === "D") {
          const door = findDoor(next.x, next.y, currentMapNameRef.current);
          if (door) {
            currentMapRef.current = door.toMap;
            currentMapNameRef.current = door.toMapName;
            setCurrentMap(door.toMap);
            setCurrentMapName(door.toMapName);
            setPendingPos(door.startPos);
          }
          return prev;
        }

        setTick(t => {
          console.log("tick:", t + 1);
          return t + 1;
        });

        return next;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
}