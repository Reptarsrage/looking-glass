import { FILE_SYSTEM_MODULE_SITE_ID } from './reducers/constants'

const fileSystemModule = {
  id: FILE_SYSTEM_MODULE_SITE_ID,
  name: 'Local Files',
  description: 'Choose a directory',
  authType: '',
  supportsItemFilters: false,
  supportsAuthorFilter: false,
  supportsSourceFilter: false,
  filters: [], // TODO
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
}

export default fileSystemModule
