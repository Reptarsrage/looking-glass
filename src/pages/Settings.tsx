import React from 'react';

import ToggleButton from '../components/ToggleButton';
import useSettingsStore from '../store/settings';

function Settings() {
  const { pictureLowDataMode, videoAutoPlay } = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.update);

  function handlePictureLowDataModeChange(value: boolean) {
    updateSettings({ pictureLowDataMode: value });
  }

  function handleVideoAutoPlayChange(value: boolean) {
    updateSettings({ videoAutoPlay: value });
  }

  // TODO: Switch to per-module settings

  return (
    <div className="flex flex-1 justify-center items-start">
      <div className="rounded-xl shadow-xl flex flex-col p-8 w-screen max-w-screen-lg">
        <h1 className="text-5xl">Settings</h1>
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
