import create from "zustand";
import { persist, devtools } from "zustand/middleware";

import * as lookingGlassService from "../services/lookingGlassService";

export enum ModuleAuthType {
  None = "",
  OAuth = "oauth",
  Basic = "login",
  Implicit = "implicit",
}

export interface ModuleFilterSection {
  id: string;
  name: string;
  description: string;
  supportsMultiple: boolean;
  supportsSearch: boolean;
}

export interface ModuleSort {
  id: string;
  parentId?: string;
  name: string;
  isDefault?: boolean;
  availableInSearch?: boolean;
  exclusiveToSearch?: boolean;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  authType: ModuleAuthType;
  oAuthUrl?: string;
  icon: string;
  filters: ModuleFilterSection[];
  sort: ModuleSort[];
  supportsItemFilters: boolean;
  supportsAuthorFilter: boolean;
  supportsSourceFilter: boolean;
  supportsGalleryFilters: boolean;
}

export interface State {
  readonly fetched: boolean;
  readonly fetching: boolean;
  readonly error: unknown | null;
  readonly modules: Module[];
}

export interface Mutations {
  fetchModules: () => Promise<void>;
}

export const FILE_SYSTEM_MODULE_ID = "local";
const fileSystemModule: Module = {
  id: FILE_SYSTEM_MODULE_ID,
  name: "Local Files",
  description: "Choose a directory",
  authType: ModuleAuthType.None,
  supportsItemFilters: false,
  supportsAuthorFilter: false,
  supportsSourceFilter: false,
  supportsGalleryFilters: true,
  icon: "", // not used
  filters: [
    {
      id: "fileType",
      name: "File Type",
      description: "File or directory",
      supportsMultiple: true,
      supportsSearch: true,
    },
    {
      id: "contentType",
      name: "Content Type",
      description: "Content type",
      supportsMultiple: true,
      supportsSearch: true,
    },
  ],
  sort: [
    {
      id: "none",
      name: "None",
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "name",
      name: "Name",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "size",
      name: "Size",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "modified",
      name: "Date Modified",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "created",
      name: "Date Created",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
    {
      id: "random",
      name: "Random",
      isDefault: false,
      availableInSearch: true,
      exclusiveToSearch: false,
    },
  ],
};

const name = "module";
export const useModulesStore = create<State & Mutations>(
  persist(
    devtools(
      (set, get) => ({
        modules: [],
        fetched: false,
        fetching: false,
        error: null,

        fetchModules: async () => {
          const { fetched, fetching } = get();
          if (fetched || fetching) {
            return;
          }

          // set fetching
          set({ fetching: true }, false, `${name}/fetchModulesPending`);

          try {
            // fetch modules
            let modules = await lookingGlassService.fetchModules();
            modules = modules.concat(fileSystemModule);
            set({ modules, fetched: true }, false, `${name}/fetchModulesSuccess`);
          } catch (error: unknown) {
            console.error("An error ocurred while fetching modules", error);
            set({ fetching: false, error }, false, `${name}/fetchModulesFailure`);
          }
        },
      }),
      { name }
    ),
    {
      name,
      getStorage: () => sessionStorage,
    }
  )
);
