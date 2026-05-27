// useLampAnimation.js
// Custom hook som håndterer flicker-animasjon for lamper i Ona.

import { useState, useEffect } from "react";

export default function useLampAnimation() {
  const [lampFrame, setLampFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLampFrame(prev => prev + 1);
    }, 200); // flickerhastighet, juster etter ønske
    return () => clearInterval(timer);
  }, []);

  return lampFrame;
}