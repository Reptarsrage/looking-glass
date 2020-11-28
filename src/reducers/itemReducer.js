import produce from 'immer'

import {
  FETCH_ITEM_FILTERS,
  FETCH_ITEM_FILTERS_FAILURE,
  FETCH_GALLERY_SUCCESS,
  CLEAR_GALLERY,
  FETCH_ITEM_FILTERS_SUCCESS,
} from 'actions/types'
import {
  generateItemId,
  generateFilterId,
  generateFilterSectionId,
  handleAsyncFetch,
  handleAsyncSuccess,
  handleAsyncError,
} from './constants'
import logger from '../logger'

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialItemState = {
  id: null,
  siteId: null,
  galleryId: null,
  name: null,
  width: 0,
  height: 0,
  isVideo: false,
  isGallery: false,
  urls: [],
  poster: null,
  filters: [],
  date: null,
  source: null,
  author: null,

  fetching: false, // filters
  fetched: false, // filters
  error: null, // filters
}

const addItem = (draft, galleryId, moduleId, item) => {
  // quick sanity check
  if (!item.width || !item.height || !Array.isArray(item.urls) || item.urls.length === 0) {
    logger.error('Invalid item', item)
    return
  }

  // generate ids
  const itemId = generateItemId(galleryId, item.id)

  // translate filters
  const filters = []
  item.filters.forEach(({ filterSectionId: filterSectionSiteId, id }) => {
    const filterSectionId = generateFilterSectionId(moduleId, filterSectionSiteId)
    const toAdd = generateFilterId(filterSectionId, id)

    if (filters.indexOf(toAdd) < 0) {
      filters.push(toAdd)
    }
  })

  // if item does not exist
  if (!(itemId in draft.byId)) {
    // add item
    draft.allIds.push(itemId)

    const { id, name, width, height, isVideo, isGallery, urls, poster, author, date, source } = item
    draft.byId[itemId] = {
      siteId: id,
      id: itemId,
      galleryId,
      filters,
      urls,
      poster,
      isGallery,
      isVideo,
      name,
      width,
      height,
      date,
      source,
      author,
    }
  }
}

export default produce((draft, action) => {
  const { type, payload, meta } = action || {}

  switch (type) {
    case CLEAR_GALLERY: {
      const galleryId = meta

      // remove items
      const galleryItemsToRemove = draft.allIds.filter((id) => draft.byId[id].galleryId === galleryId)
      draft.allIds = draft.allIds.filter((id) => draft.byId[id].galleryId !== galleryId)
      galleryItemsToRemove.forEach((id) => delete draft.byId[id])
      break
    }
    case FETCH_GALLERY_SUCCESS: {
      const { galleryId, moduleId } = meta
      const gallery = payload
      const { items } = gallery

      // add items
      items.forEach((item) => addItem(draft, galleryId, moduleId, item))
      break
    }
    case FETCH_ITEM_FILTERS: {
      const { itemId } = meta
      handleAsyncFetch(draft.byId[itemId])
      break
    }
    case FETCH_ITEM_FILTERS_FAILURE: {
      const { itemId } = meta
      handleAsyncError(draft.byId[itemId], payload)
      break
    }
    case FETCH_ITEM_FILTERS_SUCCESS: {
      const { itemId, moduleId } = meta
      const filters = payload

      filters.forEach(({ filterSectionId: filterSectionSiteId, id }) => {
        const filterSectionId = generateFilterSectionId(moduleId, filterSectionSiteId)
        const toAdd = generateFilterId(filterSectionId, id)
        const values = draft.byId[itemId].filters

        if (values.indexOf(toAdd) < 0) {
          draft.byId[itemId].filters.push(toAdd)
        }
      })

      handleAsyncSuccess(draft.byId[itemId])
      break
    }

    // no default
  }
}, initialState)
