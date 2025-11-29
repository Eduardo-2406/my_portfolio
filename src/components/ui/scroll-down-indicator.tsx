
'use client';

import React, { memo } from 'react';
import { motion, useReducedMotion, cubicBezier } from 'framer-motion';
import './scroll-down-indicator.css';

const ease = cubicBezier(0.22, 1, 0.36, 1);

type ScrollDownIndicatorProps = {
  onClick: () => void;
  delay?: number;
};

const ScrollDownIndicatorBase = ({ onClick, delay = 0 }: ScrollDownIndicatorProps) => {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 };
  const animate = shouldReduceMotion
    ? { y: 0, opacity: 1 }
    : { y: 0, opacity: 1, transition: { duration: 0.3, delay, ease } };
  const exit = shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0, scale: 0.9, transition: { duration: 0.3, delay: 0, ease } };

  return (
    <motion.button
      type="button"
      aria-label="Ir a la siguiente sección"
      initial={initial}
      animate={animate}
      exit={exit}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      onClick={onClick}
    >
      <div className="scrolldown">
        <div className="chevrons" aria-hidden>
          <div className="chevrondown" />
          <div className="chevrondown" />
        </div>
      </div>
    </motion.button>
  );
};

ScrollDownIndicatorBase.displayName = 'ScrollDownIndicatorBase';

export const ScrollDownIndicator = memo(ScrollDownIndicatorBase);
