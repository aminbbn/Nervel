import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll reveal hook using IntersectionObserver.
 * - Triggers once when the target enters viewport.
 * - Does not retrigger when scrolling back.
 * - Automatically renders immediately if user prefers reduced motion.
 */
export function useScrollReveal(options?: { threshold?: number; rootMargin?: string }) {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;

    // Fallback if IntersectionObserver is not available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? '0px 0px -50px 0px',
      }
    );

    const currentElem = targetRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible, options?.threshold, options?.rootMargin]);

  return { ref: targetRef, isVisible };
}
