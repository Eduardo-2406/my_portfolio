import { useState, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const NAVIGATION_DELAY = 800; // Animation duration in ms
const WHEEL_THRESHOLD = 10;

export function useSectionNavigation(totalSections: number) {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [blockNavigation, setBlockNavigation] = useState(false);

  // Refs to keep handlers stable and avoid reattaching listeners
  const currentSectionRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const blockNavigationRef = useRef(false);
  const navigationTimeoutRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef(0);

  // keep refs in sync with state
  useEffect(() => { currentSectionRef.current = currentSection; }, [currentSection]);
  useEffect(() => { isNavigatingRef.current = isNavigating; }, [isNavigating]);
  useEffect(() => { blockNavigationRef.current = blockNavigation; }, [blockNavigation]);

  const navigate = useCallback((newIndex: number) => {
    if (isNavigatingRef.current) return;
    if (newIndex < 0 || newIndex >= totalSections) return;

    // start navigation
    isNavigatingRef.current = true;
    setIsNavigating(true);

    setCurrentSection((prev) => {
      setDirection(newIndex > prev ? 1 : -1);
      return newIndex;
    });

    // Clear existing timeout
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
    }, NAVIGATION_DELAY);
  }, [totalSections]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobile) return; // only on desktop

    const WHEEL_THROTTLE_DELAY = 100;

    const handleWheel = (event: WheelEvent) => {
      if (blockNavigationRef.current || isNavigatingRef.current) return;

      const target = event.target as HTMLElement | null;
      if (target) {
        const editable = target.closest('textarea, input, [contenteditable=""], [contenteditable="true"]');
        if (editable) return;

        let el: HTMLElement | null = target;
        while (el && el !== document.body) {
          const style = window.getComputedStyle(el);
          const canScrollY = (style.overflowY === 'auto' || style.overflowY === 'scroll');
          if (canScrollY && el.scrollHeight > el.clientHeight) return;
          el = el.parentElement;
        }
      }

      const now = Date.now();
      if (now - lastWheelTimeRef.current < WHEEL_THROTTLE_DELAY) return;
      lastWheelTimeRef.current = now;

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      if (event.deltaY > 0) {
        navigate(currentSectionRef.current + 1);
      } else {
        navigate(currentSectionRef.current - 1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (blockNavigationRef.current || isNavigatingRef.current) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigate(currentSectionRef.current + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigate(currentSectionRef.current - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isMobile]);

  return { currentSection, direction, navigate, setBlockNavigation };
}
