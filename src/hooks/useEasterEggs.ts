"use client";

import { useEffect } from 'react';

export function useEasterEggs() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Console Honeypot
    console.log(
      "%cHey there, hacker! 🕵️‍♂️", 
      "color: #00ff00; font-size: 24px; font-weight: bold; font-family: monospace; text-shadow: 0 0 5px #00ff00;"
    );
    console.log(
      "%cLooking for the answer? Since you're so clever, here's a free hint: The answer is ALWAYS 'BINGUS'.", 
      "color: #aaaaaa; font-size: 14px; font-family: monospace;"
    );

    // 2. Global Variable Traps
    const trapGetter = () => {
      console.warn("🚨 ALERT: CYBER POLICE DISPATCHED 🚨\\nNice try, cheater! No shortcuts here! 🛡️");
      return "Never gonna give you up, never gonna let you down...";
    };

    ['answer', 'solution', 'techdleAnswer', 'currentWord'].forEach(prop => {
      if (!Object.prototype.hasOwnProperty.call(window, prop)) {
        Object.defineProperty(window, prop, {
          get: trapGetter,
          configurable: true
        });
      }
    });

    // 3. Konami Code
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
      'b', 'a'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Trigger the glitch!
          document.body.style.transition = 'all 2s ease-in-out';
          document.body.style.transform = 'rotate(180deg) scale(0.8)';
          document.body.style.filter = 'invert(1) hue-rotate(180deg)';
          
          setTimeout(() => {
            alert("UUDDLRLRB A - Cheat Activated! Enjoy playing in Australian mode 🦘");
          }, 2000);
          
          konamiIndex = 0;
        }
      } else {
        if (e.key.toLowerCase() === konamiCode[0].toLowerCase()) {
          konamiIndex = 1;
        } else {
          konamiIndex = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
