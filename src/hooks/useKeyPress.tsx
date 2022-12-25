import { useEffect } from 'react';

/**
 * runs given callback when the given key is pressed
 */
const useKeyPress = (targetKey: string, callback: (event: KeyboardEvent) => void) => {
  const handler = (event: KeyboardEvent) => {
    if (event.key === targetKey && callback) {
      callback(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handler, false);

    return () => {
      window.removeEventListener('keydown', handler, false);
    };
  }, [targetKey, callback]);
};

export default useKeyPress;
