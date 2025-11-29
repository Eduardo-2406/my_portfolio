import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Shared observer registry to avoid creating one IntersectionObserver per element.
type ObserverEntry = {
  observer: IntersectionObserver;
  elements: Set<Element>;
};

const OBSERVER_REGISTRY = new Map<string, ObserverEntry>();
const ELEMENT_HANDLERS = new WeakMap<Element, { onChange: (v: boolean) => void; triggerOnce: boolean; key: string }>();

function getKey(threshold: number | number[], rootMargin: string) {
  return JSON.stringify({ threshold, rootMargin });
}

function createObserver(key: string, threshold: number | number[], rootMargin: string) {
  const callback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      const el = entry.target;
      const record = ELEMENT_HANDLERS.get(el);
      if (!record) continue;
      if (entry.isIntersecting) {
        record.onChange(true);
        if (record.triggerOnce) {
          const reg = OBSERVER_REGISTRY.get(record.key);
          reg?.observer.unobserve(el);
          reg?.elements.delete(el);
          ELEMENT_HANDLERS.delete(el);
        }
      } else {
        if (!record.triggerOnce) record.onChange(false);
      }
    }
  };

  const observer = new IntersectionObserver(callback, { threshold, rootMargin });
  const entry: ObserverEntry = { observer, elements: new Set() };
  OBSERVER_REGISTRY.set(key, entry);
  return entry;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.2, rootMargin = '0px', triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const el = elementRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const key = getKey(threshold, rootMargin);
    let registry = OBSERVER_REGISTRY.get(key);
    if (!registry) registry = createObserver(key, threshold, rootMargin);

    const handler = (v: boolean) => {
      if (!mountedRef.current) return;
      setIsVisible((prev) => (prev === v ? prev : v));
    };

    ELEMENT_HANDLERS.set(el, { onChange: handler, triggerOnce, key });
    registry.observer.observe(el);
    registry.elements.add(el);

    return () => {
      mountedRef.current = false;
      const rec = ELEMENT_HANDLERS.get(el);
      if (rec) {
        const reg = OBSERVER_REGISTRY.get(rec.key);
        reg?.observer.unobserve(el);
        reg?.elements.delete(el);
        ELEMENT_HANDLERS.delete(el);
        // If no elements left, disconnect and clean up observer
        if (reg && reg.elements.size === 0) {
          reg.observer.disconnect();
          OBSERVER_REGISTRY.delete(rec.key);
        }
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
