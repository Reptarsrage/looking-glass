import React, { useEffect, useState } from 'react';

import { ReactComponent as CloseIcon } from './assets/close.svg';
import Icon from './assets/favicon.png';
import { ReactComponent as MaximizeIcon } from './assets/maximize.svg';
import { ReactComponent as MinimizeIcon } from './assets/minimize.svg';
import { ReactComponent as RestoreIcon } from './assets/restore.svg';

const defaultIcon = Icon;
const defaultTitle = 'The Looking Glass';

function AppBar() {
  const [maximized, setMaximized] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [icon, setIcon] = useState(defaultIcon);

  // set initial value
  useEffect(() => {
    window.electronAPI.isMaximized().then(setMaximized);
  }, []);

  // subscribe to changes
  useEffect(() => {
    const toggleMaxRestoreButtons = async () => {
      const isMaximized = await window.electronAPI.isMaximized();
      setMaximized(isMaximized);
    };

    window.electronAPI.on('maximize', toggleMaxRestoreButtons);
    window.electronAPI.on('unmaximize', toggleMaxRestoreButtons);

    return () => {
      window.electronAPI.off('maximize', toggleMaxRestoreButtons);
      window.electronAPI.off('unmaximize', toggleMaxRestoreButtons);
    };
  }, []);

  // subscribe to title
  useEffect(() => {
    const handleSetTitle = async (_event?: Event, value?: string) => {
      setTitle(value || defaultTitle);
    };

    const handleSetIcon = async (_event?: Event, value?: string) => {
      setIcon(value || defaultIcon);
    };

    window.electronAPI.on('title', handleSetTitle);
    window.electronAPI.on('icon', handleSetIcon);

    return () => {
      window.electronAPI.off('title', handleSetTitle);
      window.electronAPI.off('icon', handleSetIcon);
    };
  }, []);

  const minimize = () => {
    window.electronAPI.minimize();
  };

  const maximize = () => {
    if (maximized) {
      window.electronAPI.unmaximize();
    } else {
      window.electronAPI.maximize();
    }
  };

  const close = () => {
    window.electronAPI.close();
  };

  return (
    <div className="flex justify-between draggable z-50">
      <div className="inline-flex items-center px-2">
        <img className="inline-block" src={icon} alt="favicon" width={18} height={18} />
        <span className="text-xs ml-2">{title}</span>
      </div>

      <div className="undraggable grid grid-cols-3 h-8 w-36">
        <button
          tabIndex={-1}
          onClick={minimize}
          className="text-gray-900 flex justify-center items-center hover:bg-gray-200 active:bg-gray-100"
        >
          <MinimizeIcon />
        </button>

        <button
          tabIndex={-1}
          onClick={maximize}
          className="text-gray-900 flex justify-center items-center hover:bg-gray-200 active:bg-gray-100"
        >
          {maximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>

        <button
          tabIndex={-1}
          onClick={close}
          className="hover:bg-red-500 hover:text-white active:bg-red-800 active:text-white flex justify-center items-center"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

export default AppBar;
