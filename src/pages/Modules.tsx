import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { fetchModules } from '../api';
import { ReactComponent as FolderIcon } from '../assets/folder.svg';
import useModuleStore, { fileSystemModule, fileSystemModuleId } from '../store/modules';

function Modules() {
  const navigate = useNavigate();
  const setModules = useModuleStore((state) => state.setModules);

  // Fetch all sections at once
  // TODO: Placeholder data
  const { data, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
    onSuccess: (modules) => {
      setModules(modules);
    },
  });

  // effect to update window title
  useEffect(() => {
    window.electronAPI.setIcon();
    window.electronAPI.setTitle();
  }, []);

  async function handleLocalClick() {
    try {
      const result = await window.electronAPI.chooseFolder();
      if (!result) {
        return;
      }

      const params = new URLSearchParams();
      params.set('galleryId', result);
      navigate(`/module/${fileSystemModuleId}?${params.toString()}`);
    } catch (error) {
      console.warn('Error while choosing a directory', error);
    }
  }

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  // TODO: Add error
  // TODO: Add no results

  return (
    <ul>
      {data.map((module) => (
        <li key={module.id} className="border-b-2">
          <Link
            to={`/module/${module.id}`}
            className="flex p-2 gap-2 items-center cursor-pointer transition duration-150 hover:bg-slate-50 active:bg-slate-200"
          >
            <div className="rounded-full h-9 w-9 bg-slate-600 overflow-hidden flex">
              <img src={module.icon} alt={module.id} />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold">{module.name}</span>
              <span>{module.description}</span>
            </div>
          </Link>
        </li>
      ))}
      <li key={fileSystemModuleId} className="border-b-2">
        <button
          onClick={handleLocalClick}
          className="flex p-2 w-full gap-2 items-center cursor-pointer transition duration-150 hover:bg-slate-50 active:bg-slate-200"
        >
          <div className="rounded-full h-9 w-9 bg-slate-600 overflow-hidden flex text-white p-1">
            <FolderIcon />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold">{fileSystemModule.name}</span>
            <span>{fileSystemModule.description}</span>
          </div>
        </button>
      </li>
    </ul>
  );
}

export default Modules;
