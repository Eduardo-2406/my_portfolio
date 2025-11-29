"use client";

import { memo, useRef, useLayoutEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { navItems, type NavItem } from '@/lib/nav-links';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

interface DesktopHeaderProps {
  onNavigate: (href: NavItem['href']) => void;
  activeSection: number;
}

interface IndicatorStyle {
  left: number;
  width: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const INDICATOR_SPRING_CONFIG = {
  type: "spring" as const,
  // Aumentamos stiffness para que la transición sea más rápida
  // y reducimos ligeramente la masa para que responda con más agilidad.
  stiffness: 120,
  damping: 22,
  mass: 1,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════════════════════════════════════

export const DesktopHeader = memo(function DesktopHeader({ 
  onNavigate, 
  activeSection 
}: DesktopHeaderProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(null);

  // useLayoutEffect para medir y posicionar antes del paint
  useLayoutEffect(() => {
    const activeButton = buttonRefs.current[activeSection];

    if (activeButton) {
      // Read layout properties inside useLayoutEffect to avoid paint thrash.
      // We set the measured `left` and `width` once per activeSection change.
      // Motion will animate `x` (transform) which is GPU-accelerated for smoothness.
      const left = activeButton.offsetLeft;
      const width = activeButton.offsetWidth;

      // batch state update
      setIndicatorStyle({ left, width });
    }
  }, [activeSection]);

  const prefersReducedMotion = useReducedMotion();
  const indicatorTransition = prefersReducedMotion ? { duration: 0 } : INDICATOR_SPRING_CONFIG;

  // Callback estable para asignar refs a los botones
  const setButtonRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
    buttonRefs.current[index] = el;
  }, []);

  // Recompute indicator on resize to keep it in sync when layout changes
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    const handleResize = () => {
      // throttle with rAF
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const activeButton = buttonRefs.current[activeSection];
        if (activeButton) {
          setIndicatorStyle({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
        }
        raf = 0;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [activeSection]);

  return (
    <header className="sticky top-4 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
        <nav 
          className="relative flex justify-center items-center gap-1 bg-foreground/5 dark:bg-card/70 px-2 py-1.5 rounded-2xl border border-border/40 w-[580px]"
          role="navigation"
          aria-label="Navegación principal"
        >
          {navItems.map((item, index) => (
            <button
              key={item.href}
              ref={setButtonRef(index)}
              onClick={() => onNavigate(item.href)}
              aria-current={activeSection === index ? 'page' : undefined}
              className={cn(
                "relative whitespace-nowrap font-medium transition-colors duration-300 rounded-xl px-6 py-2 tracking-wide z-10 flex-1",
                "text-[clamp(0.875rem,1vw,1.125rem)]",
                activeSection === index
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
              )}
            >
              {item.label}
            </button>
          ))}
          
          {/* Indicador animado - solo renderizar cuando tenemos medidas */}
          {indicatorStyle && (
            <motion.div
              className="absolute bg-card/50 border border-primary/40 shadow-sm rounded-xl pointer-events-none"
              initial={false}
              // position at left:0 and animate transform via `x` for GPU acceleration
              animate={{
                x: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={indicatorTransition}
              style={{
                left: 0,
                height: 'calc(100% - 12px)',
                top: '6px',
                willChange: 'transform, width',
              }}
            />
          )}
        </nav>

        {/* Toggle de tema */}
        <div className="absolute right-4 md:right-6 text-[#5C9993] dark:text-primary">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
});
