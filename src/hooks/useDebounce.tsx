import { useEffect, useRef } from "react";

interface TimeoutID {
  id: number;
}

// Animation frame based implementation of setTimeout.
// Inspired by Joe Lambert, https://gist.github.com/joelambert/1002116#file-requesttimeout-js
function cancelTimeout(timeoutID: TimeoutID) {
  cancelAnimationFrame(timeoutID.id);
}

/**
 * debounces given callback function
 */
function requestTimeout(callback: (params: any[]) => void, params: any[], delay: number): TimeoutID {
  const start = performance.now();

  function tick() {
    if (performance.now() - start >= delay) {
      callback(params);
    } else {
      timeoutID.id = requestAnimationFrame(tick);
    }
  }

  const timeoutID: TimeoutID = {
    id: requestAnimationFrame(tick),
  };

  return timeoutID;
}

function useDebounce(callback: Function, interval: number = 150) {
  const timeoutIdRef = useRef<TimeoutID | null>(null);

  function callCallback(params: any[]) {
    timeoutIdRef.current = null;
    callback(...params);
  }

  function callbackDebounced(...params: any[]) {
    if (timeoutIdRef.current !== null) {
      cancelTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = requestTimeout(callCallback, params, interval);
  }

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        cancelTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return callbackDebounced;
}

export default useDebounce;
