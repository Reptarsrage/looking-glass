import produce from 'immer'

import {
  FETCH_FILTERS,
  FETCH_FILTERS_SUCCESS,
  FETCH_FILTERS_FAILURE,
  FETCH_MODULES_SUCCESS,
  FETCH_ITEM_FILTERS_SUCCESS,
  FETCH_GALLERY_SUCCESS,
} from 'actions/types'
import {
  generateFilterId,
  generateFilterSectionId,
  generateModuleId,
  initialAsyncState,
  handleAsyncFetch,
  handleAsyncError,
  handleAsyncSuccess,
} from './constants'

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialFilterSectionState = {
  id: null,
  siteId: null,
  moduleId: null,
  name: null,
  description: null,
  values: [],
  ...initialAsyncState,
}

const addFilterSectionForModule = (draft, module) => {
  // generate moduleId
  const moduleId = generateModuleId(module.id)

  // add filter sections
  module.filters.forEach((filterSection) => {
    const id = generateFilterSectionId(moduleId, filterSection.id)
    draft.allIds.push(id)
    draft.byId[id] = {
      ...initialFilterSectionState,
      ...filterSection,
      siteId: filterSection.id,
      id,
      moduleId,
    }
  })
}

export default produce((draft, action) => {
  const { type, payload, meta } = action || {}

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      // add filter sections for modules
      modules.forEach((module) => addFilterSectionForModule(draft, module))
      break
    }
    case FETCH_FILTERS: {
      const moduleId = meta

      draft.allIds
        .filter((id) => draft.byId[id].moduleId === moduleId)
        .forEach((id) => handleAsyncFetch(draft.byId[id]))

      break
    }
    case FETCH_ITEM_FILTERS_SUCCESS: {
      const { moduleId } = meta
      const filters = payload

      // add filters for modules
      filters.forEach(({ filterSectionId: filterSectionSiteId, id }) => {
        const filterSectionId = generateFilterSectionId(moduleId, filterSectionSiteId)
        const toAdd = generateFilterId(filterSectionId, id)
        const { values } = draft.byId[filterSectionId]
        if (values.indexOf(toAdd) < 0) {
          values.push(toAdd)
        }
      })

      break
    }
    case FETCH_FILTERS_SUCCESS: {
      const filterSectionId = meta
      handleAsyncSuccess(draft.byId[filterSectionId])

      payload.forEach(({ id }) => {
        const toAdd = generateFilterId(filterSectionId, id)
        const { values } = draft.byId[filterSectionId]
        if (values.indexOf(toAdd) < 0) {
          draft.byId[filterSectionId].values.push(toAdd)
        }
      })

      break
    }
    case FETCH_FILTERS_FAILURE: {
      const filterSectionId = meta
      handleAsyncError(draft.byId[filterSectionId], payload)
      break
    }
    case FETCH_GALLERY_SUCCESS: {
      const { moduleId } = meta
      const gallery = payload
      const { items } = gallery

      // add item filters
      items.forEach((item) => {
        item.filters.forEach(({ filterSectionId: filterSectionSiteId, id }) => {
          const filterSectionId = generateFilterSectionId(moduleId, filterSectionSiteId)
          const toAdd = generateFilterId(filterSectionId, id)
          const { values } = draft.byId[filterSectionId]
          if (values.indexOf(toAdd) < 0) {
            values.push(toAdd)
          }
        })
      })

      break
    }

    // no default
  }
}, initialState)
