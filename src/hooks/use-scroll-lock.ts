import { useLayoutEffect, useRef } from 'react';

/**
 * Locks page scroll when necessary (during loader or for desktop section navigation).
 * Optimizations:
 * - Uses useLayoutEffect to avoid flicker when changing body styles.
 * - Restores the original overflow on cleanup instead of forcing an empty string.
 * - Avoids writing to DOM when the desired value is already set.
 */
export function useScrollLock(appReady: boolean, isMobileView: boolean) {
  const prevOverflowRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const el = document.body;

    if (prevOverflowRef.current === null) {
      prevOverflowRef.current = el.style.overflow || '';
    }

    const shouldLock = !appReady || !isMobileView;
    const desired = shouldLock ? 'hidden' : prevOverflowRef.current || '';

    if (el.style.overflow !== desired) {
      el.style.overflow = desired;
    }

    return () => {
      // restore original value
      if (prevOverflowRef.current !== null && el.style.overflow !== prevOverflowRef.current) {
        el.style.overflow = prevOverflowRef.current;
      }
    };
  }, [appReady, isMobileView]);
}
