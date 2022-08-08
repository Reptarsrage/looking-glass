import { useEffect } from "react";

interface IntersectionObserverArgs {
  target: React.RefObject<HTMLElement>;
  onIntersect?: () => void;
  enabled?: boolean;
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
}

/**
 * uses an IntersectionObserver to run the callback if a given DOM element appears on screen
 */
export default function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  root = window.document.body,
  rootMargin = "0px",
  threshold = 0.05,
}: IntersectionObserverArgs) {
  useEffect(() => {
    function onIntersectCallback(entries: IntersectionObserverEntry[]) {
      const [entry] = entries;
      if (entry.isIntersecting && onIntersect) {
        onIntersect();
      }
    }

    if (enabled && target?.current) {
      const observed = target.current;
      const observer = new IntersectionObserver(onIntersectCallback, {
        root,
        rootMargin,
        threshold,
      });

      observer.observe(observed);
      return () => {
        observer.unobserve(observed);
      };
    }
  }, [enabled, onIntersect, root, rootMargin, target, threshold]);
}
