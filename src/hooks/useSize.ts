import { useState, useEffect } from "react";

/**
 * uses a ResizeObserver to keep track of size changes in the given DOM element
 */
export default function useSize(elementRef: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize(entries: ResizeObserverEntry[]) {
      setSize({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      });
    }

    const cur = elementRef.current;
    if (cur !== null) {
      const observer = new ResizeObserver(handleResize);
      observer.observe(cur);

      return () => {
        observer.unobserve(cur);
      };
    }
  }, [elementRef]);

  return size;
}
