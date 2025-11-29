"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useSpring } from "framer-motion";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type CursorMode = 'default' | 'text';
type Theme = 'light' | 'dark';

interface SmoothCursorProps {
  theme?: Theme;
}

const CURSOR_CONFIG = {
  default: { width: 16, height: 16, radius: 9999 },
  text: { width: 2, height: 28, radius: 2 },
} as const;

const THEME_COLORS = {
  light: 'rgb(12, 19, 35)',      // Oscuro para tema claro
  dark: 'rgb(208, 217, 225)',    // Claro para tema oscuro
} as const;

const SPRING_CONFIG = {
  position: { stiffness: 400, damping: 30, mass: 0.5 },
  shape: { type: 'tween' as const, duration: 0.2, ease: 'easeOut' as const },
} as const;

// Tags interactivos que no deben mostrar cursor de texto
const INTERACTIVE_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']);
const NAVIGATION_TAGS = new Set(['NAV', 'HEADER']);

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Verifica si un nodo contiene texto en las coordenadas especificadas
 */
const isTextNodeAtPoint = (node: Node, x: number, y: number): boolean => {
  if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) {
    return false;
  }

  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects();
  
  return Array.from(rects).some(
    rect => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  );
};

/**
 * Determina si el elemento o sus ancestros son interactivos
 */
const isInteractiveElement = (element: HTMLElement): boolean => {
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < 6) {
    if (INTERACTIVE_TAGS.has(current.tagName)) return true;
    if (current.getAttribute('role') === 'button') return true;
    current = current.parentElement;
    depth++;
  }

  return false;
};

/**
 * Verifica si el elemento está dentro de navegación o header
 */
const isInNavigation = (element: HTMLElement): boolean => {
  let current: HTMLElement | null = element;
  let depth = 0;
  
  while (current && depth < 8) {
    if (NAVIGATION_TAGS.has(current.tagName)) return true;
    current = current.parentElement;
    depth++;
  }
  
  return false;
};

/**
 * Detecta si hay texto bajo el cursor
 */
const hasTextAtPoint = (element: HTMLElement, x: number, y: number): boolean => {
  // Check first child
  if (element.firstChild && isTextNodeAtPoint(element.firstChild, x, y)) {
    return true;
  }
  
  // Check all child nodes
  for (let i = 0; i < element.childNodes.length; i++) {
    if (isTextNodeAtPoint(element.childNodes[i], x, y)) {
      return true;
    }
  }
  
  return false;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function SmoothCursor({ theme = 'light' }: SmoothCursorProps) {
  const [mounted, setMounted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [mode, setMode] = useState<CursorMode>('default');

  // rafRef removed; per-effect RAF ids are handled locally to avoid stale refs
  const lastPosRef = useRef({ x: 0, y: 0 });
  const prevModeRef = useRef<CursorMode>('default');

  // Motion values for cursor position
  const x = useSpring(0, SPRING_CONFIG.position);
  const y = useSpring(0, SPRING_CONFIG.position);

  // Memoize cursor color based on theme
  const cursorColor = useMemo(() => THEME_COLORS[theme], [theme]);

  // Memoize cursor dimensions based on mode
  const cursorDimensions = useMemo(() => CURSOR_CONFIG[mode], [mode]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Mount effect: hide default cursor
  useEffect(() => {
    // Inject a minimal style and use a class on <html> to scope cursor hiding.
    const style = document.createElement('style');
    style.dataset.smoothCursor = 'true';
    style.textContent = 'html.smooth-cursor-hide * { cursor: none !important; }';
    document.head.appendChild(style);
    document.documentElement.classList.add('smooth-cursor-hide');

    return () => {
      document.documentElement.classList.remove('smooth-cursor-hide');
      style.remove();
    };
  }, []);

  // Mouse visibility handlers
  useEffect(() => {
    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerenter', handlePointerEnter);

    // If touch input is detected, disable the custom cursor for better UX
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        // remove the injected class so native cursors/touches resume
        document.documentElement.classList.remove('smooth-cursor-hide');
        setMounted(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  // Mouse move handler with RAF optimization
  useEffect(() => {
    // Use pointermove for broader input support; fallback to mousemove if needed
    let rafId: number | null = null;

    const onPointerMove = (clientX: number, clientY: number) => {
      const last = lastPosRef.current;
      const dx = Math.abs(clientX - last.x);
      const dy = Math.abs(clientY - last.y);

      if (dx < 2 && dy < 2 && rafId === null) return;

      lastPosRef.current = { x: clientX, y: clientY };

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        x.set(clientX);
        y.set(clientY);

        const element = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
        if (!element) {
          if (prevModeRef.current !== 'default') {
            prevModeRef.current = 'default';
            setMode('default');
          }
          rafId = null;
          return;
        }

        const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
        const isInteractive = isInteractiveElement(element);
        const inNavigation = isInNavigation(element);

        let shouldShowTextCursor = false;
        if (isInput) shouldShowTextCursor = true;
        else if (!isInteractive && !inNavigation) {
          // Only perform the expensive text hit test when other cheap checks pass
          shouldShowTextCursor = hasTextAtPoint(element, clientX, clientY);
        }

        const newMode: CursorMode = shouldShowTextCursor ? 'text' : 'default';
        if (prevModeRef.current !== newMode) {
          prevModeRef.current = newMode;
          setMode(newMode);
        }

        rafId = null;
      });
    };

    const handlePointer = (ev: PointerEvent) => onPointerMove(ev.clientX, ev.clientY);
    const handleMouse = (ev: MouseEvent) => onPointerMove(ev.clientX, ev.clientY);

    window.addEventListener('pointermove', handlePointer);
    // Fallback
    window.addEventListener('mousemove', handleMouse, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('mousemove', handleMouse);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [x, y]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[100000]"
      style={{ width: 0, height: 0 }}
    >
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x,
          y,
          backgroundColor: cursorColor,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          contain: 'layout style paint',
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? 0.85 : 0,
          width: cursorDimensions.width,
          height: cursorDimensions.height,
          borderRadius: cursorDimensions.radius,
        }}
        transition={{
          opacity: { duration: 0.15 },
          width: SPRING_CONFIG.shape,
          height: SPRING_CONFIG.shape,
          borderRadius: SPRING_CONFIG.shape,
        }}
      />
    </div>
  );
}