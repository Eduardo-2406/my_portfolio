import { useLayoutEffect, useRef } from 'react';

/**
 * Hook to manage cursor style based on mobile/desktop view.
 * Optimizations:
 * - Uses useLayoutEffect to avoid flicker when manipulating inline styles.
 * - Restores the previous cursor value on unmount instead of forcing 'default'.
 * - Avoids writing to the DOM when the value is already correct.
 */
export function useCursorStyle(isMobileView: boolean) {
  const initialCursorRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const el = document.body;

    // Store the initial cursor value only on first run
    if (initialCursorRef.current === null) {
      initialCursorRef.current = el.style.cursor || '';
    }

    const desired = isMobileView ? 'default' : 'none';

    if (el.style.cursor !== desired) {
      el.style.cursor = desired;
    }

    return () => {
      // Restore only what we replaced
      if (initialCursorRef.current !== null) {
        el.style.cursor = initialCursorRef.current;
      }
    };
  }, [isMobileView]);
}
