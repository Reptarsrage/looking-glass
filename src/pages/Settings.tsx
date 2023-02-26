import clsx from 'clsx';
import React from 'react';

import ToggleButton from '../components/ToggleButton';
import useSettingsStore from '../store/settings';

function Settings() {
  const { pictureLowDataMode, videoAutoPlay, theme } = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.update);

  function handlePictureLowDataModeChange(value: boolean) {
    updateSettings({ pictureLowDataMode: value });
  }

  function handleVideoAutoPlayChange(value: boolean) {
    updateSettings({ videoAutoPlay: value });
  }

  function handleThemeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value as 'system' | 'light' | 'dark';
    updateSettings({ theme: value });
  }

  // TODO: Switch to per-module settings

  return (
    <div className="flex flex-1 justify-center items-start">
      <div className="rounded-xl shadow-xl flex flex-col p-8 w-screen max-w-screen-lg dark:bg-slate-800">
        <h1 className="text-5xl dark:text-white mb-8">Settings</h1>

        <div className="my-4">
          <div className="flex items-center" tabIndex={0} role="button">
            <div className="mr-4">Theme</div>
            <select
              value={theme}
              onChange={handleThemeChange}
              className={clsx(
                'py-0 px-4 border rounded-md outline-none h-9',
                'dark:text-white bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900',
                'border-slate-300 dark:border-slate-500 focus:border-slate-400 dark:focus:border-slate-400'
              )}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="my-4">
          <ToggleButton
            label="Use thumbnail images for masonry"
            value={pictureLowDataMode}
            onChange={handlePictureLowDataModeChange}
          />
        </div>
        <div className="my-4">
          <ToggleButton label="Autoplay videos" value={videoAutoPlay} onChange={handleVideoAutoPlayChange} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
