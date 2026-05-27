// useWaterAnimation.js
// Custom hook som håndterer vannanimasjon i Ona.
// Returnerer en frame-teller som oppdateres hvert 500ms.

import { useState, useEffect } from "react";

export default function useWaterAnimation() {
  const [waterFrame, setWaterFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaterFrame(prev => prev - 1);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return waterFrame;
}