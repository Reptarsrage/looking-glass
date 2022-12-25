import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { Module } from '../types';

type State = {
  moduleIds: string[];
  modulesById: Record<string, Module>;
  setModules: (modules: Module[]) => void;
};

const useModuleStore = create<State>()(
  persist(
    devtools((set) => ({
      moduleIds: [],
      modulesById: {},
      setModules: (modules) => {
        const moduleIds = modules.map((module) => module.id);
        const modulesById = modules.reduce((acc, module) => {
          acc[module.id] = module;
          return acc;
        }, {} as Record<string, Module>);

        set({ moduleIds, modulesById });
      },
    })),
    {
      name: 'modules',
      getStorage: () => sessionStorage,
    }
  )
);

export default useModuleStore;
