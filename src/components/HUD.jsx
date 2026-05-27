import { getTimeInfo } from "../state/gameState";

export default function HUD({ tick, pos, onEditorOpen }) {
  const { isNight, day, timeStr } = getTimeInfo(tick);

  return (
    <div style={{ position: "fixed", top: "12px", right: "16px", fontFamily: "monospace", fontSize: "14px", color: "#fff" }}>
      <div>{isNight ? "NIGHT" : "DAY"} {timeStr}</div>
      <div>day {day}</div>
      <div>x:{pos.x} y:{pos.y}</div>

       <button
        onClick={onEditorOpen}
        style={{
          marginTop: "8px",
          background: "transparent",
          border: "1px solid #444",
          color: "#666",
          fontFamily: "monospace",
          fontSize: "11px",
          cursor: "pointer",
          padding: "2px 8px",
        }}
      >
        EDITOR
      </button>

    </div>
  );
}