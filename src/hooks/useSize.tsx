import useResizeObserver from '@react-hook/resize-observer';
import React, { useLayoutEffect, useState } from 'react';

function isRef(pet: HTMLElement | React.RefObject<HTMLElement> | null): pet is React.RefObject<HTMLElement> {
  return (pet as React.RefObject<HTMLElement>)?.current !== undefined;
}

/**
 * keeps track of the size of an element.
 */
function useSize(target: HTMLElement | React.RefObject<HTMLElement> | null): DOMRect | undefined {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (target && isRef(target)) {
      setSize(target.current?.getBoundingClientRect());
    } else if (target) {
      setSize(target.getBoundingClientRect());
    }
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
}

export default useSize;
