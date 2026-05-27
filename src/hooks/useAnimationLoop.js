// useAnimationLoop.js
import { useState, useEffect } from "react";

export default function useAnimationLoop() {
  const [frame, setFrame] = useState(0);
  const [flickerSignal, setFlickerSignal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => prev + 1);
      setFlickerSignal(Math.random() < 0.1); // 1/5 sjanse
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return { frame, flickerSignal };
}