"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If the user prefers reduced motion, disable the entrance/exit animation
  if (prefersReducedMotion) {
    return isVisible ? (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={scrollToTop}
          className="rounded-full shadow-lg w-10 h-10 bg-background/80 backdrop-blur-md border-2 border-foreground/10 flex items-center justify-center outline-none"
          aria-label="Volver al inicio"
        >
          <ArrowUp className="h-4 w-4 text-foreground" />
        </button>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-20 right-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <button
            onClick={scrollToTop}
            className="rounded-full shadow-lg w-10 h-10 bg-background/80 backdrop-blur-md border-2 border-foreground/10 flex items-center justify-center outline-none"
            aria-label="Volver al inicio"
          >
            <ArrowUp className="h-4 w-4 text-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
