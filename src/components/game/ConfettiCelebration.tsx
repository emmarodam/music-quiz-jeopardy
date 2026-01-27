'use client';

import { useEffect, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import type { CreateTypes, Options } from 'canvas-confetti';
import { useGameStore } from '@/stores/gameStore';

const canvasStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 100,
};

export function ConfettiCelebration() {
  const { showConfetti, clearConfetti } = useGameStore();
  const confettiRef = useRef<CreateTypes | null>(null);

  const fire = () => {
    const confetti = confettiRef.current;
    if (!confetti) return;

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'],
    };

    function fireConfetti(particleRatio: number, opts: Options) {
      if (!confetti) return;
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Left side burst
    fireConfetti(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.2, y: 0.7 },
    });

    fireConfetti(0.2, {
      spread: 60,
      origin: { x: 0.2, y: 0.7 },
    });

    fireConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.2, y: 0.7 },
    });

    // Right side burst
    fireConfetti(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.8, y: 0.7 },
    });

    fireConfetti(0.2, {
      spread: 60,
      origin: { x: 0.8, y: 0.7 },
    });

    fireConfetti(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.8, y: 0.7 },
    });

    // Center burst
    fireConfetti(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.5 },
    });

    fireConfetti(0.1, {
      spread: 120,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.5 },
    });
  };

  useEffect(() => {
    if (showConfetti) {
      fire();
      const timer = setTimeout(() => {
        clearConfetti();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, clearConfetti]);

  return (
    <ReactCanvasConfetti
      style={canvasStyles}
      onInit={({ confetti }) => {
        confettiRef.current = confetti;
      }}
    />
  );
}
