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
  name: null,
  description: null,
  authType: null,
  oAuthUrl: null,
  icon: null,
  sort: [],
  filters: [],
  defaultGalleryId: null,
  supportsItemFilters: false,
  supportsAuthorFilter: false,
  supportsSourceFilter: false,
}

export default produce((draft, action) => {
  const { type, payload } = action || {}

  switch (type) {
    case FETCH_MODULES: {
      draft.allIds = []
      draft.byId = {}

      handleAsyncFetch(draft)
      break
    }
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      // add modules
      modules.forEach((module) => {
        const { id: siteId, sort, filters, ...rest } = module

        const moduleId = generateModuleId(siteId)
        const defaultGalleryId = generateGalleryId(moduleId, DEFAULT_GALLERY_ID)

        // sort values
        let sortValues
        if (Array.isArray(sort)) {
          sortValues = sort.map(({ id }) => generateSortId(moduleId, id))
        }

        // filter sections
        let filterSections
        if (Array.isArray(filters)) {
          filterSections = filters.map(({ id }) => generateFilterSectionId(moduleId, id))
        }

        draft.allIds.push(moduleId)

        draft.byId[moduleId] = {
          ...initialModuleState,
          ...rest,
          siteId,
          id: moduleId,
          sort: sortValues,
          filters: filterSections,
          defaultGalleryId,
        }
      })

      // add file system module
      draft.allIds.push(FILE_SYSTEM_MODULE_ID)

      draft.byId[FILE_SYSTEM_MODULE_ID] = {
        ...initialModuleState,
        id: FILE_SYSTEM_MODULE_ID,
        name: 'Local files',
        description: 'Choose a directory',
        defaultGalleryId: generateGalleryId(FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID),
      }

      handleAsyncSuccess(draft)
      break
    }
    case FETCH_MODULES_FAILURE: {
      handleAsyncError(draft, payload)
      break
    }

    // no default
  }
}, initialState)
