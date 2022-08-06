import { useMemo, useEffect, useState } from "react";
import { useNavigationType, useLocation } from "react-router-dom";

/**
 * Keeps track of history stack
 */
export default function useNavigationStack() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [stack, setStack] = useState<string[]>([]);
  const [stackPointer, setStackPointer] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const currentLocation = `${location.pathname}${location.search}`;

    // Handle "REPLACE" navigation. These don't currently ever happen.
    if (navigationType === "REPLACE") {
      // Simply replace last element of the stack
      setStack(stack.slice(0, stackPointer + 1).concat(currentLocation));
      setDirection(0);
      return;
    }

    // Handle "PUSH" navigation. These can occur if the user navigates to a new route, or
    // react refresh updates the current page
    if (navigationType === "PUSH" && stack[stackPointer] !== currentLocation) {
      // Handle navigation to a new URL by pushing a new location to the stack and incrementing the pointer.
      // Make sure to chop off old stack items that may have cropped up via the back button.
      setStack(stack.slice(0, stackPointer + 1).concat(currentLocation));
      setStackPointer(stackPointer + 1);
      setDirection(1);
      return;
    }

    // Handle "POP" navigation. These occur when going forward, backward, and on initialization (when app is first opened).
    if (navigationType === "POP") {
      if (stack.length === 0) {
        // Handle initialize by creating stack
        setStack([currentLocation]);
        setStackPointer(0);
        setDirection(0);
        return;
      }

      if (stack[stackPointer - 1] === currentLocation) {
        // Handle back by decrementing pointer
        setStackPointer(stackPointer - 1);
        setDirection(-1);
        return;
      }

      // Handle forward by incrementing pointer
      setStackPointer(stackPointer + 1);
      setDirection(1);
    }
  }, [location]);

  const hasBack = stackPointer > 0;
  const hasForward = stackPointer < stack.length - 1;
  return { hasBack, hasForward, direction };
}
