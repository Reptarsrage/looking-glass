import React, { useEffect, useState } from 'react';

import Icon from './assets/favicon.png';
import useAppParams from './hooks/useAppParams';
import useModuleStore from './store/modules';

function AppBar() {
  const [maximized, setMaximized] = useState(false);
  const [title, setTitle] = useState('The Looking Glass');

  const [appParams] = useAppParams();
  const { moduleId } = appParams;
  const module = useModuleStore((state) => (moduleId ? state.modulesById[moduleId] : undefined));
  const icon = module?.icon ?? Icon;

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
  // TODO: THis doesn't work
  useEffect(() => {
    const handleSetTitle = async () => {
      setTitle(await window.electronAPI.getTitle());
    };

    window.electronAPI.on('title', handleSetTitle);

    return () => {
      window.electronAPI.off('title', handleSetTitle);
    };
  }, []);

  const minimize = () => {
    window.electronAPI.minimize();
  };

  const maximize = () => {
    window.electronAPI.maximize();
  };

  const unmaximize = () => {
    window.electronAPI.unmaximize();
  };

  const close = () => {
    window.electronAPI.close();
  };

  return (
    <div className="py-0.5 flex justify-between draggable z-50">
      <div className="inline-flex items-center px-2">
        <img className="inline-block" src={icon} alt="favicon" width={18} height={18} />
        <span className="text-xs ml-2">{title}</span>
      </div>
      <div className="inline-flex -mt-1">
        <button tabIndex={-1} onClick={minimize} className="undraggable md:px-4 lg:px-3 pt-1 hover:bg-gray-300">
          &#8211;
        </button>

        {!maximized && (
          <button tabIndex={-1} onClick={maximize} className="undraggable px-6 lg:px-5 pt-1 hover:bg-gray-300">
            {'⃞'}
          </button>
        )}

        {maximized && (
          <button tabIndex={-1} onClick={unmaximize} className="undraggable px-6 lg:px-5 pt-1 hover:bg-gray-300">
            {'\u2752'}
          </button>
        )}

        <button tabIndex={-1} onClick={close} className="undraggable px-4 pt-1 hover:bg-red-500 hover:text-white">
          &#10005;
        </button>
      </div>
    </div>
  );
}

export default AppBar;
