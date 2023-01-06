import create from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { AuthType, Module } from '../types';

type State = {
  moduleIds: string[];
  modulesById: Record<string, Module>;
  setModules: (modules: Module[]) => void;
};

export const fileSystemModuleId = 'filesystem';
export const fileSystemModule: Module = {
  id: fileSystemModuleId,
  name: 'Local Files',
  description: 'Choose a directory',
  authType: AuthType.None,
  supportsItemFilters: false,
  supportsAuthorFilter: false,
  supportsSourceFilter: false,
  supportsGalleryFilters: true,
  supportsGallerySearch: false,
  supportsGallerySort: true,
  icon: '', // not used
  filters: [
    {
      id: 'fileType',
      name: 'File Type',
      description: 'File or directory',
      supportsMultiple: true,
      supportsSearch: true,
    },
    {
      id: 'contentType',
      name: 'Content Type',
      description: 'Content type',
      supportsMultiple: true,
      supportsSearch: true,
    },
  ],
  sort: [
    {
      id: 'none',
      name: 'None',
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: 'name',
      name: 'Name',
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: 'size',
      name: 'Size',
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: 'modified',
      name: 'Date Modified',
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: 'created',
      name: 'Date Created',
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: 'random',
      name: 'Random',
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
  ],
};

const useModuleStore = create<State>()(
  persist(
    devtools((set) => ({
      moduleIds: [fileSystemModuleId],
      modulesById: {
        [fileSystemModuleId]: fileSystemModule,
      },
      setModules: (modules) => {
        const moduleIds = [...modules.map((module) => module.id), fileSystemModuleId];
        const modulesById = modules.reduce(
          (acc, module) => {
            acc[module.id] = module;
            return acc;
          },
          {
            [fileSystemModuleId]: fileSystemModule,
          } as Record<string, Module>
        );

        set({ moduleIds, modulesById });
      },
    })),
    {
      name: 'modules',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useModuleStore;
