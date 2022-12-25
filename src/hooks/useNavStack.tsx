import { useEffect, useMemo, useRef, useState } from 'react';
import { NavigationType, useLocation, useNavigationType } from 'react-router-dom';

interface NavStack {
  stack: string[];
  pointer: number;
}

function saveNavigation(navStack: NavStack) {
  sessionStorage.setItem('navStack', JSON.stringify(navStack));
}

function loadNavigation(): NavStack | null {
  const saved = sessionStorage.getItem('navStack');

  if (saved) return JSON.parse(saved) as NavStack;

  return null;
}

/**
 * keeps track of current navigation stack because react router doesn't for some reason
 */
const useNavStack = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const [direction, setDirection] = useState(0);
  const [hasForward, setHasForward] = useState(false);
  const [hasBack, setHasBack] = useState(false);

  const navigationStackRef = useRef(loadNavigation() || { stack: [location.key], pointer: 0 });

  useEffect(() => {
    let { pointer, stack } = navigationStackRef.current;
    let newDirection = direction;

    if (navigationType === NavigationType.Push) {
      // Push
      // Remove all newer routes, and put current at the front, reset pointer
      stack = stack.slice(pointer);
      stack.unshift(location.key);
      pointer = 0;
      newDirection = 1;
    } else if (navigationType === NavigationType.Replace) {
      // Replace
      // Replace location at current pointer, keep stack the same
      stack[pointer] = location.key;
      newDirection = 0;
    } else if (navigationType === NavigationType.Pop) {
      const idx = stack.indexOf(location.key);
      if (idx >= 0 && pointer !== idx) {
        // Back
        // Move pointer, keep stack the same
        newDirection = pointer > idx ? 1 : -1;
        pointer = Math.min(idx);
      } else {
        // Initial load, do nothing
        newDirection = 0;
      }
    }

    setDirection(newDirection);
    setHasForward(pointer > 0);
    setHasBack(pointer < stack.length - 1);

    navigationStackRef.current = { stack, pointer };
    saveNavigation(navigationStackRef.current);
  }, [location, navigationType]);

  return useMemo(() => ({ direction, hasForward, hasBack }), [direction, hasForward, hasBack]);
};

export default useNavStack;
