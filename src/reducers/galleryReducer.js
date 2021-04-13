import produce from 'immer'
import { basename } from 'path'

import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  FETCH_MODULES_SUCCESS,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
  SET_FILE_SYSTEM_DIRECTORY,
} from 'actions/types'
import {
  DEFAULT_GALLERY_ID,
  FILE_SYSTEM_MODULE_ID,
  generateGalleryId,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  initialAsyncState,
  handleAsyncSuccess,
  generateItemId,
} from './constants'

export const initialState = {
  byId: {},
  allIds: [],
}

export const initialGalleryState = {
  id: null,
  siteId: null,
  moduleId: null,
  parentId: null,
  offset: 0,
  after: null,
  hasNext: true,
  items: [],
  name: null,
  savedScrollPosition: 0,
  ...initialAsyncState,
}

const addGallery = (draft, moduleId, gallerySiteId, name, parentId) => {
  // generate ids
  const galleryId = generateGalleryId(moduleId, gallerySiteId)

  // if gallery does not exist
  if (!(galleryId in draft.byId)) {
    // add gallery
    draft.allIds.push(galleryId)
    draft.byId[galleryId] = {
      ...initialGalleryState,
      siteId: gallerySiteId,
      id: galleryId,
      moduleId,
      name,
      parentId,
    }
  }
}

export default produce((draft, action) => {
  const { type, payload, meta } = action || {}

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = payload

      // add default module galleries for all modules
      modules.forEach(({ id, name }) => {
        const moduleId = generateModuleId(id)
        addGallery(draft, moduleId, DEFAULT_GALLERY_ID, name)
      })

      // add file system default module galleries
      addGallery(draft, FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID, 'Local Files')
      break
    }
    case FETCH_GALLERY: {
      const galleryId = meta
      handleAsyncFetch(draft.byId[galleryId])
      break
    }
    case FETCH_GALLERY_SUCCESS: {
      const { galleryId } = meta
      const gallery = payload
      const { items, ...galleryState } = gallery
      const { moduleId } = draft.byId[galleryId]

      // merge gallery state
      draft.byId[galleryId] = {
        ...draft.byId[galleryId],
        ...galleryState,
        id: galleryId,
      }

      // add items
      items
        .filter(({ width, height, urls }) => width && height && Array.isArray(urls) && urls.length > 0) // remove any poorly formatted items
        .forEach((item) => {
          const itemId = generateItemId(galleryId, item.id)
          if (draft.byId[galleryId].items.indexOf(itemId) < 0) {
            draft.byId[galleryId].items.push(itemId)
          }
        })

      // go through any items
      // for any items that are themselves galleries, add them
      items
        .filter(({ isGallery }) => isGallery)
        .forEach(({ id, name }) => addGallery(draft, moduleId, id, name, galleryId))

      // update async state
      handleAsyncSuccess(draft.byId[galleryId])
      break
    }
    case FETCH_GALLERY_FAILURE: {
      const error = payload
      const galleryId = meta
      handleAsyncError(draft.byId[galleryId], error)
      break
    }
    case CLEAR_GALLERY: {
      const galleryId = meta

      // clear gallery
      draft.byId[galleryId].items = []
      draft.byId[galleryId].offset = 0
      draft.byId[galleryId].after = null
      draft.byId[galleryId].hasNext = true
      draft.byId[galleryId].savedScrollPosition = 0
      draft.byId[galleryId].fetched = false
      draft.byId[galleryId].error = null

      break
    }
    case SAVE_SCROLL_POSITION: {
      const galleryId = meta
      const scrollPosition = payload
      draft.byId[galleryId].savedScrollPosition = scrollPosition
      break
    }
    case SET_FILE_SYSTEM_DIRECTORY: {
      const directoryPath = payload
      const siteId = Buffer.from(directoryPath, 'utf-8').toString('base64')

      addGallery(draft, FILE_SYSTEM_MODULE_ID, siteId, basename(directoryPath))
      break
    }

    // no default
  }
}, initialState)
