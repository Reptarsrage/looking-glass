import { useEffect } from 'react';
import { useMediaMatch } from 'rooks';

import useSettingsStore from '../store/settings';

function useTheme() {
  const prefersDark = useMediaMatch('(prefers-color-scheme: dark)');
  const { theme } = useSettingsStore((state) => state.settings);

  useEffect(() => {
    if ((theme === 'system' && prefersDark) || theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefersDark, theme]);
}

export default useTheme;
