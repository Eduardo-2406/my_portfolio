import { useSyncExternalStore } from 'react';

let _reducedMotionMql: MediaQueryList | null = null;

function getReducedMotionMql(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return null;
  if (_reducedMotionMql === null) {
    _reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return _reducedMotionMql;
}

function addMqlListener(mql: MediaQueryList, cb: () => void) {
  if ('addEventListener' in mql) {
    mql.addEventListener('change', cb as EventListener);
  } else {
    // Legacy Safari: fall back to addListener typed as unknown to avoid `any`
    (mql as unknown as { addListener: (fn: () => void) => void }).addListener(cb);
  }
}

function removeMqlListener(mql: MediaQueryList, cb: () => void) {
  if ('removeEventListener' in mql) {
    mql.removeEventListener('change', cb as EventListener);
  } else {
    // Legacy Safari: fall back to removeListener typed as unknown to avoid `any`
    (mql as unknown as { removeListener: (fn: () => void) => void }).removeListener(cb);
  }
}

function subscribe(notify: () => void) {
  const mql = getReducedMotionMql();
  if (!mql) return () => {};
  const handler = () => notify();
  addMqlListener(mql, handler);
  return () => removeMqlListener(mql, handler);
}

function getSnapshot() {
  const mql = getReducedMotionMql();
  return mql ? mql.matches : false;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
