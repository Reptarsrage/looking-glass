import { createContext, useState } from "react";

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

export const FILE_SYSTEM_MODULE_ID = "local";
export const fileSystemModule: Module = {
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

interface Context {
  readonly modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
}

export const ModuleContext = createContext<Context>({ modules: [], setModules: () => {} });

export const ModuleProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);
  return <ModuleContext.Provider value={{ modules, setModules }}>{children}</ModuleContext.Provider>;
};
