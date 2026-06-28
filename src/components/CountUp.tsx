"use client";

import { useEffect, useState } from 'react';

export function CountUp({ 
  end, 
  duration = 1000, 
  delay = 0 
}: { 
  end: number; 
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * ease));

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, delay]);

  return <span>{count}</span>;
}
