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
  module.filterBy.forEach((filterSection) => {
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

const filterSectionReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {}

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        const modules = payload

        // add filter sections for modules
        modules.forEach((module) => addFilterSectionForModule(draft, module))
        break
      }
      case FETCH_FILTERS: {
        const filterSectionId = meta
        handleAsyncFetch(state.byId[filterSectionId], draft.byId[filterSectionId])
        break
      }
      case FETCH_ITEM_FILTERS_SUCCESS: {
        const { moduleId } = meta
        const filters = payload

        // add filters for modules
        filters.forEach(({ filterId, id }) => {
          const filterSectionId = generateFilterSectionId(moduleId, filterId)
          const toAdd = generateFilterId(filterSectionId, id)
          const { values } = draft.byId[filterSectionId]
          if (filterSectionId in draft.byId && values.indexOf(toAdd) < 0) {
            draft.byId[filterSectionId].values = [...values, toAdd]
          }
        })

        break
      }
      case FETCH_FILTERS_SUCCESS: {
        const filterSectionId = meta
        handleAsyncSuccess(state.byId[filterSectionId], draft.byId[filterSectionId])

        payload.forEach(({ id }) => {
          const toAdd = generateFilterId(filterSectionId, id)
          const { values } = draft.byId[filterSectionId]
          if (values.indexOf(toAdd) < 0) {
            draft.byId[filterSectionId].values = [...values, toAdd]
          }
        })

        break
      }
      case FETCH_FILTERS_FAILURE: {
        const filterSectionId = meta
        handleAsyncError(state.byId[filterSectionId], draft.byId[filterSectionId], payload)
        break
      }
      case FETCH_GALLERY_SUCCESS: {
        const { moduleId } = meta
        const gallery = payload
        const { items } = gallery

        // add item filters
        items.forEach((item) => {
          item.filters.forEach(({ filterId, id }) => {
            const filterSectionId = generateFilterSectionId(moduleId, filterId)
            const toAdd = generateFilterId(filterSectionId, id)
            if (filterSectionId in draft.byId) {
              const { values } = draft.byId[filterSectionId]
              if (filterSectionId in draft.byId && values.indexOf(toAdd) < 0) {
                draft.byId[filterSectionId].values = [...values, toAdd]
              }
            }
          })
        })

        break
      }
      default:
        break // Nothing to do
    }
  })

export default filterSectionReducer
