import { useState, useEffect, useRef } from "react";
import { MAP_REGISTRY } from "./maps/mapRegistry";
import useKeyboard from "./hooks/useKeyboard";
import useAnimationLoop from "./hooks/useAnimationLoop";
import MapRenderer from "./components/MapRenderer";
import HUD from "./components/HUD";
import { getTimeInfo, getTwilightFactor } from "./state/gameState";
import { MAP_CONFIG } from "./utils/doorUtils";
import MapEditor from "./components/MapEditor";


export default function App() {
  const MAP = MAP_REGISTRY["map0"];
  const [pos, setPos] = useState({ x: 201, y: 56 });
  const { frame, flickerSignal: flicker } = useAnimationLoop();
  const [currentMap, setCurrentMap] = useState(MAP);
  const [currentMapName, setCurrentMapName] = useState("world");
  const [pendingPos, setPendingPos] = useState(null);

  const currentMapRef = useRef(MAP);
  const currentMapNameRef = useRef("world");
  const [tick, setTick] = useState(0);
  const { isNight } = getTimeInfo(tick);
  const mapConfig = MAP_CONFIG[currentMapName] ?? { indoor: false };
  const twilight = getTwilightFactor(tick);
  const effectiveTwilight = mapConfig.indoor
    ? (mapConfig.lit ? 0 : 1)
    : twilight;

  const [editorOpen, setEditorOpen] = useState(false);


  console.log("tick:", tick, "twilight:", twilight, "time:", getTimeInfo(tick).timeStr);


  useEffect(() => {
    if (pendingPos) {
      setPos(pendingPos);
      setPendingPos(null);
    }
  }, [currentMap, pendingPos]);

  useKeyboard(
    currentMapRef,
    currentMapNameRef,
    setPos,
    setCurrentMap,
    setCurrentMapName,
    setPendingPos,
    setTick
  );

  return (
    <div style={{
      background: "#000000",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      fontSize: "20px",
    }}>

    <MapRenderer
      currentMap={currentMap}
      pos={pos}
      frame={frame}
      flicker={flicker}
      twilight={effectiveTwilight}
    />

      <HUD tick={tick} pos={pos} onEditorOpen={() => setEditorOpen(true)} />
      
      {editorOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 100,
        }}>
          <MapEditor
            initialMap={currentMap}
            onClose={() => setEditorOpen(false)}
          />
        </div>
      )}
    </div>
  );
}