import { useEffect } from "react";

interface IntersectionObserverArgs {
  enabled?: boolean;
  onIntersect?: () => void;
  root?: React.RefObject<HTMLElement>;
  target: React.RefObject<HTMLElement>;
  rootMargin?: string;
  threshold?: number;
}

/**
 * uses an IntersectionObserver to run the callback if a given DOM element appears on screen
 */
export default function useIntersectionObserver({
  enabled = true,
  onIntersect,
  root,
  rootMargin = "0px",
  target,
  threshold = 0.1,
}: IntersectionObserverArgs) {
  useEffect(() => {
    // if not enabled, or we are incapable or observing the target element, then short circuit
    if (!enabled || onIntersect === undefined || target?.current === null) {
      return;
    }

    // configure intersection observer
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        }),
      {
        root: root?.current,
        rootMargin,
        threshold,
      }
    );

    // observe
    const elt = target.current;
    observer.observe(elt);
    return () => {
      observer.unobserve(elt);
    };
  }, [target.current, enabled]);
}
