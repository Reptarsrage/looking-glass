import { useLayoutEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

function useSize(target: React.RefObject<HTMLElement> | null): DOMRect | undefined {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    setSize(target?.current?.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
}

export default useSize;
