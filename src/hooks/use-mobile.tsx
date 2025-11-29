import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 1280;

let _mobileMql: MediaQueryList | null = null;

function getMobileMql(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return null;
  if (_mobileMql === null) {
    _mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  }
  return _mobileMql;
}

function addMqlListener(mql: MediaQueryList, cb: () => void) {
  if ('addEventListener' in mql) {
    mql.addEventListener('change', cb);
  } else {
    // Legacy Safari
    // @ts-expect-error addListener exists on older types
    mql.addListener(cb);
  }
}

function removeMqlListener(mql: MediaQueryList, cb: () => void) {
  if ('removeEventListener' in mql) {
    mql.removeEventListener('change', cb);
  } else {
    // @ts-expect-error removeListener exists on older types
    mql.removeListener(cb);
  }
}

function subscribe(notify: () => void) {
  const mql = getMobileMql();
  if (!mql) return () => {};
  const handler = () => notify();
  addMqlListener(mql, handler);
  return () => removeMqlListener(mql, handler);
}

function getSnapshot() {
  const mql = getMobileMql();
  return mql ? mql.matches : false;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
