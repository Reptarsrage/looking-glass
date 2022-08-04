import { useEffect } from "react";

/**
 * runs given callback when the give key is pressed
 */
const useKeyPress = (targetKey: string, callback: () => void) => {
  const handler = (event: KeyboardEvent) => {
    if (event.key === targetKey && callback) {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handler, false);

    return () => {
      window.removeEventListener("keydown", handler, false);
    };
  }, [targetKey, callback]);
};

export default useKeyPress;
