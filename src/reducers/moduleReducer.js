import produce from 'immer'

import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_FAILURE } from 'actions/types'
import {
  DEFAULT_GALLERY_ID,
  FILE_SYSTEM_MODULE_ID,
  generateGalleryId,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  handleAsyncSuccess,
  initialAsyncState,
  generateSortId,
  generateFilterSectionId,
} from './constants'

export const initialState = {
  byId: {},
  allIds: [],
  ...initialAsyncState,
}

export const initialModuleState = {
  id: null,
  siteId: null,
  title: null,
  description: null,
  authType: null,
  oAuthUrl: null,
  icon: null,
  sortBy: [],
  filterBy: [],
  defaultGalleryId: null,
  itemFiltersEnabled: false,
}

const addModule = (draft, module, actualModuleId) => {
  // generate id
  const moduleId = actualModuleId || generateModuleId(module.id)

  // if module does not exist
  if (!(moduleId in draft.byId)) {
    const { sortBy, filterBy, ...rest } = module
    const sortValues = (sortBy || []).map(({ id }) => generateSortId(moduleId, id))
    const filterSections = (filterBy || []).map(({ id }) => generateFilterSectionId(moduleId, id))

    // add module
    draft.allIds.push(moduleId)
    draft.byId[moduleId] = {
      ...rest,
      siteId: module.id,
      id: moduleId,
      sortBy: sortValues,
      filterBy: filterSections,
      defaultGalleryId: generateGalleryId(moduleId, DEFAULT_GALLERY_ID),
    }
  }
}

export default produce((draft, action) => {
  const { type, payload } = action || {}

  switch (type) {
    case FETCH_MODULES: {
      handleAsyncFetch(draft)
      break
    }
    case FETCH_MODULES_SUCCESS: {
      const modules = payload
      handleAsyncSuccess(draft)

      // add modules
      modules.forEach((module) => addModule(draft, module))

      // add file system module
      addModule(
        draft,
        {
          ...initialModuleState,
          id: FILE_SYSTEM_MODULE_ID,
          title: 'Local files',
          description: 'Choose a directory',
          authType: '',
        },
        FILE_SYSTEM_MODULE_ID
      )

      break
    }
    case FETCH_MODULES_FAILURE: {
      handleAsyncError(draft, payload)
      break
    }
    default:
      break // Nothing to do
  }
}, initialState)
