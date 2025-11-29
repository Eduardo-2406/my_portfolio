"use client";

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import React, { ReactNode, memo, useMemo, isValidElement, cloneElement } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ScrollRevealSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const EASING = [0.22, 1, 0.36, 1] as const;
const INITIAL = { opacity: 0, y: 40, scale: 0.98, filter: 'blur(12px)', visibility: 'hidden' } as const;
const VISIBLE = { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', visibility: 'visible' } as const;
const VARIANTS = { hidden: INITIAL, visible: VISIBLE } as const;
const WILL_CHANGE = { willChange: 'opacity, transform, filter' } as const;

export const ScrollRevealSection = memo(function ScrollRevealSection({ children, delay = 0, className = '' }: ScrollRevealSectionProps) {
  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.15, triggerOnce: true });
  const prefersReducedMotion = useReducedMotion();

  const visible = isVisible || prefersReducedMotion;

  const transition = useMemo(() => ({
    duration: 0.9,
    delay: visible ? delay : 0,
    ease: EASING,
    filter: { duration: 0.7, ease: EASING },
    scale: { duration: 0.7, ease: EASING },
    visibility: { delay: visible ? delay : 0 },
  }), [delay, visible]);

  // Forward visibility state to child components that accept `parentContentVisible`.
  const content = (isValidElement(children) && typeof children !== 'string')
    ? cloneElement(children as React.ReactElement, { parentContentVisible: visible })
    : children;

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      variants={VARIANTS}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      transition={transition}
      className={className}
      style={WILL_CHANGE}
    >
      {content}
    </motion.div>
  );
});

(ScrollRevealSection as unknown as { displayName?: string }).displayName = 'ScrollRevealSection';
