import produce from 'immer';

import {
  DEFAULT_GALLERY_ID,
  FILE_SYSTEM_MODULE_ID,
  generateGalleryId,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  initialAsyncState,
  SEARCH_GALLERY_ID,
} from './constants';
import {
  ADD_GALLERY,
  FETCH_MODULES_SUCCESS,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  UPDATE_SEARCH,
} from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialGalleryState = {
  id: null,
  siteId: null,
  offset: 0,
  before: null,
  after: null,
  hasNext: true,
  searchQuery: null,
  ...initialAsyncState,
};

const addGallery = (draft, moduleId, siteId, actualGalleryId = null) => {
  // generate ids
  const galleryId = actualGalleryId || generateGalleryId(moduleId, siteId);

  // if gallery does not exist
  if (!(galleryId in draft.byId)) {
    // add gallery
    draft.allIds.push(galleryId);
    draft.byId[galleryId] = {
      ...initialGalleryState,
      siteId,
      id: galleryId,
    };
  }
};

const galleryReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case ADD_GALLERY: {
        const { moduleId, galleryId, siteId } = payload;
        if (!(galleryId in state.galleries.byId)) {
          addGallery(draft, moduleId, { id: siteId }, galleryId);
        }

        break;
      }
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        // Add default module galleries for all modules
        modules.forEach(({ id }) => {
          const moduleId = generateModuleId(id);
          addGallery(draft, moduleId, DEFAULT_GALLERY_ID);
          addGallery(draft, moduleId, SEARCH_GALLERY_ID);
        });

        // Add file system default module galleries
        addGallery(draft, FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID);
        addGallery(draft, FILE_SYSTEM_MODULE_ID, SEARCH_GALLERY_ID);
        break;
      }
      case FETCH_GALLERY: {
        const { galleryId } = payload;
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = meta;
        const gallery = payload;
        const { items, ...galleryState } = gallery;

        // merge gallery state
        draft.byId[galleryId] = {
          ...state.byId[galleryId],
          ...galleryState,
          id: galleryId,
          siteId: gallery.id,
          fetching: false,
          success: true,
          error: null,
        };

        break;
      }
      case FETCH_GALLERY_ERROR: {
        const error = payload;
        const galleryId = meta;
        handleAsyncError(state.byId[galleryId], draft.byId[galleryId], error);
        break;
      }
      case UPDATE_SEARCH: {
        const searchQuery = payload;
        const { galleryId } = meta;
        handleAsyncFetch(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        draft.galleries.byId[galleryId].searchQuery = searchQuery;
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default galleryReducer;
