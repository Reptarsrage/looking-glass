import produce from 'immer'

import { FETCH_FILTERS_SUCCESS, FETCH_GALLERY_SUCCESS, FETCH_ITEM_FILTERS_SUCCESS } from 'actions/types'
import { generateFilterId, generateFilterSectionId } from './constants'

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialFilterState = {
  id: null,
  siteId: null,
  filterSectionId: null,
  name: null,
}

const addFiltersForSection = (draft, filterSectionId, filter) => {
  // generate moduleId
  const filterId = generateFilterId(filterSectionId, filter.id)

  // add filters
  if (!(filterId in draft.byId)) {
    draft.allIds.push(filterId)
    draft.byId[filterId] = {
      ...initialFilterState,
      ...filter,
      siteId: filter.id,
      id: filterId,
      filterSectionId,
    }
  }
}

export default produce((draft, action) => {
  const { type, payload, meta } = action || {}

  switch (type) {
    case FETCH_FILTERS_SUCCESS: {
      // add filters for modules
      const filterSectionId = meta
      payload.forEach((filter) => addFiltersForSection(draft, filterSectionId, filter))

      // TODO: add file system filter options
      break
    }
    case FETCH_ITEM_FILTERS_SUCCESS: {
      const { moduleId } = meta
      const filters = payload

      // add filters for modules
      filters.forEach(({ filterId, ...filter }) => {
        const filterSectionId = generateFilterSectionId(moduleId, filterId)
        addFiltersForSection(draft, filterSectionId, filter)
      })

      break
    }
    case FETCH_GALLERY_SUCCESS: {
      const { moduleId } = meta
      const gallery = payload
      const { items } = gallery

      // add item filters
      items.forEach((item) => {
        item.filters.forEach(({ filterId, ...filter }) => {
          const filterSectionId = generateFilterSectionId(moduleId, filterId)
          addFiltersForSection(draft, filterSectionId, filter)
        })
      })

      break
    }
    default:
      break // nothing to do
  }
}, initialState)
