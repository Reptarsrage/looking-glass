import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as FolderIcon } from '../assets/folder.svg';
import NoResults from '../components/NoResults';
import ServerDown from '../components/ServerDown';
import useModulesQuery from '../hooks/useModulesQuery';
import { fileSystemModule, fileSystemModuleId } from '../store/modules';
import type { Module } from '../types';

type ModuleEltProps = {
  module: Module;
};

function ModuleElt({ module }: ModuleEltProps) {
  if (module.isPlaceholder) {
    return (
      <li key={module.id} className="border-b-2 dark:border-slate-800">
        <div className="flex p-2 gap-2 items-center cursor-pointer transition duration-150 hover:bg-slate-50 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 group">
          <div className="rounded-full h-12 w-12 overflow-hidden flex transition-transform group-hover:scale-105 group-active:scale-95 animate-pulse bg-slate-700" />

          <div className="flex flex-col flex-1 items-start">
            <span className="text-lg font-semibold animate-pulse bg-slate-700 rounded h-5 my-1 w-32" />
            <span className="animate-pulse bg-slate-700 rounded h-4 my-1 w-64" />
          </div>
        </div>
      </li>
    );
  }

  return (
    <li key={module.id} className="border-b-2 dark:border-slate-800">
      <Link
        to={`/module/${module.id}`}
        className="flex p-2 gap-2 items-center cursor-pointer transition duration-150 hover:bg-slate-50 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 group"
      >
        <div className="rounded-full h-12 w-12 bg-slate-600 overflow-hidden flex transition-transform group-hover:scale-105 group-active:scale-95">
          <img src={module.icon} alt={module.id} />
        </div>

        <div className="flex flex-col flex-1">
          <div className="text-lg font-semibold dark:text-white">{module.name}</div>
          <div>{module.description}</div>
        </div>
      </Link>
    </li>
  );
}

function Modules() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useModulesQuery();

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

  if (isError) {
    return <ServerDown />;
  }

  if (data?.length === 0) {
    return <NoResults />;
  }

  return (
    <ul className="overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300 scrollbar-track:!rounded dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50">
      {(data || []).map((module) => (
        <ModuleElt key={module.id} module={module} />
      ))}

      {!isLoading && (
        <li key={fileSystemModuleId} className="border-b-2 dark:border-slate-800">
          <button
            onClick={handleLocalClick}
            className="flex p-2 w-full gap-2 items-center cursor-pointer text-left transition duration-150 group hover:bg-slate-50 active:bg-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          >
            <div className="rounded-full h-12 w-12 bg-blue-500 overflow-hidden flex text-white p-2 transition-transform group-hover:scale-105 group-active:scale-95">
              <FolderIcon />
            </div>

            <div className="flex flex-col flex-1">
              <div className="text-lg font-semibold">{fileSystemModule.name}</div>
              <div>{fileSystemModule.description}</div>
            </div>
          </button>
        </li>
      )}
    </ul>
  );
}

export default Modules;
