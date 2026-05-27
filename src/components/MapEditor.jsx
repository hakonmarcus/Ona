import { useState, useCallback, useEffect, useRef } from "react";
import { TILES } from "../data/tiles";
import { MAP_REGISTRY } from "../maps/mapRegistry";

const DEFAULT_W = 64;
const DEFAULT_H = 64;
const DEFAULT_FILL = ".";
const VIEW_W = 128;
const VIEW_H = 72;

function makeGrid(w, h, fill) {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

function parseBrush(text) {
  return text.split("\n").map(l => l.split(""));
}

const inputStyle = {
  background: "#0d1117",
  border: "1px solid #30363d",
  borderRadius: "4px",
  color: "#e6edf3",
  fontFamily: "'Courier New', monospace",
  fontSize: "12px",
  padding: "4px 6px",
  width: "52px",
  outline: "none",
};

const btnStyle = (color) => ({
  background: color,
  color: "#0d1117",
  border: "none",
  borderRadius: "4px",
  padding: "5px 12px",
  cursor: "pointer",
  fontFamily: "'Courier New', monospace",
  fontSize: "12px",
  fontWeight: "bold",
});

const selectStyle = {
  background: "#0d1117",
  border: "1px solid #30363d",
  borderRadius: "4px",
  color: "#e6edf3",
  fontFamily: "'Courier New', monospace",
  fontSize: "12px",
  padding: "4px 6px",
  outline: "none",
};

export default function MapEditor({ onClose }) {
  const [gridW, setGridW] = useState(DEFAULT_W);
  const [gridH, setGridH] = useState(DEFAULT_H);
  const [grid, setGrid] = useState(() => makeGrid(DEFAULT_W, DEFAULT_H, DEFAULT_FILL));
  const [brushText, setBrushText] = useState("#");
  const [tool, setTool] = useState("brush");
  const [mousePos, setMousePos] = useState(null);
  const [isPainting, setIsPainting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newW, setNewW] = useState(DEFAULT_W);
  const [newH, setNewH] = useState(DEFAULT_H);
  const [fontSize, setFontSize] = useState(14);
  const [selectedMap, setSelectedMap] = useState(Object.keys(MAP_REGISTRY)[0]);
  const [camX, setCamX] = useState(0);
  const [camY, setCamY] = useState(0);

  // Box select state
  const [selectStart, setSelectStart] = useState(null);
  const [selectEnd, setSelectEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const CELL_W = 10;
  const CELL_H = 18;

  const canvasRef = useRef(null);

  const brush = parseBrush(brushText);
  const brushH = brush.length;
  const brushW = Math.max(...brush.map(r => r.length));

  const viewW = Math.min(VIEW_W, gridW);
  const viewH = Math.min(VIEW_H, gridH);

  // Normalize selection so x1/y1 is always top-left
  const getSelectionBounds = () => {
    if (!selectStart || !selectEnd) return null;
    return {
      x1: Math.min(selectStart.x, selectEnd.x),
      y1: Math.min(selectStart.y, selectEnd.y),
      x2: Math.max(selectStart.x, selectEnd.x),
      y2: Math.max(selectStart.y, selectEnd.y),
    };
  };

  const isSelected = (mapX, mapY) => {
    const bounds = getSelectionBounds();
    if (!bounds) return false;
    return mapX >= bounds.x1 && mapX <= bounds.x2 && mapY >= bounds.y1 && mapY <= bounds.y2;
  };

  const applyBrush = useCallback((gx, gy, currentGrid) => {
    const next = currentGrid.map(r => [...r]);
    brush.forEach((row, dy) => {
      row.forEach((ch, dx) => {
        if (ch === " ") return;
        const tx = gx + dx;
        const ty = gy + dy;
        if (ty >= 0 && ty < next.length && tx >= 0 && tx < next[0].length) {
          next[ty][tx] = ch;
        }
      });
    });
    return next;
  }, [brush]);

  const handleMouseDown = (mapX, mapY) => {
    if (tool === "brush") {
      setIsPainting(true);
      setGrid(prev => applyBrush(mapX, mapY, prev));
    } else if (tool === "select") {
      setSelectStart({ x: mapX, y: mapY });
      setSelectEnd({ x: mapX, y: mapY });
      setIsSelecting(true);
    }
  };

  const handleMouseEnter = (mapX, mapY) => {
    setMousePos({ x: mapX, y: mapY });
    if (tool === "brush" && isPainting) {
      setGrid(prev => applyBrush(mapX, mapY, prev));
    } else if (tool === "select" && isSelecting) {
      setSelectEnd({ x: mapX, y: mapY });
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
    setIsSelecting(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Scroll kamera med piltaster
  useEffect(() => {
    const handleKey = (e) => {
      const step = 10;
      if (e.key === "ArrowUp")    setCamY(prev => Math.max(0, prev - step));
      if (e.key === "ArrowDown")  setCamY(prev => Math.min(gridH - viewH, prev + step));
      if (e.key === "ArrowLeft")  setCamX(prev => Math.max(0, prev - step));
      if (e.key === "ArrowRight") setCamX(prev => Math.min(gridW - viewW, prev + step));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gridW, gridH, viewW, viewH]);

  const exportMap = () => {
    const rows = grid.map(row => `  "${row.join("")}"`).join(",\n");
    const output = `const map = [\n${rows}\n];\n\nexport default map;`;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const copySelection = () => {
    const bounds = getSelectionBounds();
    if (!bounds) return;
    const lines = [];
    for (let y = bounds.y1; y <= bounds.y2; y++) {
      lines.push(grid[y].slice(bounds.x1, bounds.x2 + 1).join(""));
    }
    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    // Legg også inn i brush-feltet
    setBrushText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const createNew = () => {
    setGridW(newW);
    setGridH(newH);
    setGrid(makeGrid(newW, newH, DEFAULT_FILL));
    setCamX(0);
    setCamY(0);
    setSelectStart(null);
    setSelectEnd(null);
  };

  const loadMap = () => {
    const map = MAP_REGISTRY[selectedMap];
    if (!map) return;
    const loaded = map.map(row => row.split(""));
    setGrid(loaded);
    setGridW(loaded[0].length);
    setGridH(loaded.length);
    setCamX(0);
    setCamY(0);
    setSelectStart(null);
    setSelectEnd(null);
  };

  const isGhost = (mapX, mapY) => {
    if (!mousePos || tool !== "brush") return false;
    const dx = mapX - mousePos.x;
    const dy = mapY - mousePos.y;
    return dy >= 0 && dy < brushH && dx >= 0 && dx < brushW && brush[dy]?.[dx] !== undefined;
  };

  const ghostChar = (mapX, mapY) => {
    if (!mousePos) return null;
    const dx = mapX - mousePos.x;
    const dy = mapY - mousePos.y;
    return brush[dy]?.[dx] ?? null;
  };

  const visibleRows = grid.slice(camY, camY + viewH);
  const bounds = getSelectionBounds();

  return (
    <div style={{
      background: "#0d1117",
      height: "100vh",
      fontFamily: "'Courier New', monospace",
      color: "#c9d1d9",
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      overflow: "hidden",
    }}>
      {/* Toolbar */}
      <div style={{
        background: "#161b22",
        borderBottom: "1px solid #30363d",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}>
        <span style={{ color: "#58a6ff", fontWeight: "bold", fontSize: "15px", letterSpacing: "2px" }}>
          ONA MAP EDITOR
        </span>

        <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

        <div style={{ display: "flex", gap: "4px" }}>
          {["brush", "select"].map(t => (
            <button key={t} onClick={() => { setTool(t); setSelectStart(null); setSelectEnd(null); }} style={{
              background: tool === t ? "#58a6ff" : "#21262d",
              color: tool === t ? "#0d1117" : "#8b949e",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "4px 12px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "12px",
              fontWeight: tool === t ? "bold" : "normal",
            }}>
              {t === "brush" ? "BRUSH" : "SELECT"}
            </button>
          ))}
        </div>

        <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#8b949e", paddingTop: "6px" }}>BRUSH</span>
          <textarea
            value={brushText}
            onChange={e => setBrushText(e.target.value)}
            rows={Math.max(2, brushText.split("\n").length)}
            style={{
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "4px",
              color: "#e6edf3",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              padding: "4px 8px",
              resize: "both",
              minWidth: "80px",
              lineHeight: "1.4",
              outline: "none",
              userSelect: "text",
            }}
            spellCheck={false}
          />
        </div>

        <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "#8b949e" }}>NEW</span>
          <input type="number" value={newW} onChange={e => setNewW(parseInt(e.target.value) || 1)} style={inputStyle} min={1} max={512} />
          <span style={{ color: "#8b949e", fontSize: "11px" }}>x</span>
          <input type="number" value={newH} onChange={e => setNewH(parseInt(e.target.value) || 1)} style={inputStyle} min={1} max={512} />
          <button onClick={createNew} style={btnStyle("#3fb950")}>CREATE</button>
        </div>

        <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "#8b949e" }}>SIZE</span>
          <input type="number" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value) || 8)} style={inputStyle} min={6} max={48} />
        </div>

        <div style={{ width: "1px", height: "24px", background: "#30363d" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <select value={selectedMap} onChange={e => setSelectedMap(e.target.value)} style={selectStyle}>
            {Object.keys(MAP_REGISTRY).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={loadMap} style={btnStyle("#e3b341")}>LOAD</button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {tool === "select" && bounds && (
            <button onClick={copySelection} style={btnStyle(copied ? "#3fb950" : "#8b949e")}>
              {copied ? "KOPIERT!" : "KOPIER UTVALG"}
            </button>
          )}
          <button onClick={exportMap} style={btnStyle(copied ? "#3fb950" : "#58a6ff")}>
            {copied ? "KOPIERT!" : "KOPIER ARRAY"}
          </button>
          {onClose && (
            <button onClick={onClose} style={btnStyle("#f85149")}>LUKK</button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        padding: "16px",
        cursor: tool === "brush" ? "crosshair" : "crosshair",
      }}>
        <div
          ref={canvasRef}
          style={{ display: "inline-block", lineHeight: `${CELL_H}px` }}
          onMouseLeave={() => { setMousePos(null); }}
          onMouseDown={e => e.preventDefault()}
        >
          {visibleRows.map((row, screenY) => {
            const mapY = camY + screenY;
            return (
              <div key={mapY} style={{ display: "flex", height: CELL_H }}>
                {row.slice(camX, camX + viewW).map((cell, screenX) => {
                  const mapX = camX + screenX;
                  const ghost = isGhost(mapX, mapY);
                  const gc = ghost ? ghostChar(mapX, mapY) : null;
                  const selected = isSelected(mapX, mapY);

                  return (
                    <span
                      key={mapX}
                      onMouseDown={() => handleMouseDown(mapX, mapY)}
                      onMouseEnter={() => handleMouseEnter(mapX, mapY)}
                      style={{
                        display: "inline-block",
                        width: CELL_W,
                        height: CELL_H,
                        fontSize: "14px",
                        textAlign: "center",
                        lineHeight: `${CELL_H}px`,
                        transform: `scale(${fontSize / 14})`,
                        color: ghost
                          ? "rgba(88,166,255,0.5)"
                          : (TILES[cell]?.color ?? "#3d4450"),
                        background: ghost
                          ? "rgba(88,166,255,0.08)"
                          : selected
                          ? "rgba(88,166,255,0.2)"
                          : "transparent",
                        outline: selected ? "1px solid rgba(88,166,255,0.4)" : "none",
                        boxSizing: "border-box",
                      }}
                    >
                      {ghost && gc !== null ? gc : cell}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        background: "#161b22",
        borderTop: "1px solid #30363d",
        padding: "4px 16px",
        fontSize: "11px",
        color: "#8b949e",
        display: "flex",
        gap: "16px",
      }}>
        <span>{gridW}x{gridH}</span>
        <span>cam: {camX},{camY}</span>
        {mousePos && <span>x:{mousePos.x} y:{mousePos.y}</span>}
        {bounds && <span>utvalg: {bounds.x2 - bounds.x1 + 1}x{bounds.y2 - bounds.y1 + 1}</span>}
        <span>brush: {brushW}x{brushH}</span>
        <span style={{ color: "#444", fontSize: "10px" }}>piltaster = scroll</span>
        <span style={{ color: tool === "brush" ? "#58a6ff" : "#3fb950" }}>{tool.toUpperCase()}</span>
      </div>
    </div>
  );
}