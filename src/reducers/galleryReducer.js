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
  handleAsyncSuccess,
  generateItemId,
} from './constants';
import {
  ADD_GALLERY,
  FETCH_MODULES_SUCCESS,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  UPDATE_SEARCH,
  UPDATE_SORT,
  CLEAR_GALLERY,
  UPDATE_FILTER,
} from '../actions/types';

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialGalleryState = {
  id: null,
  siteId: null,
  moduleId: null,
  offset: 0,
  count: 0,
  after: null,
  hasNext: true,
  searchQuery: null,
  currentSort: null,
  currentFilter: null,
  items: [],
  title: null,
  ...initialAsyncState,
};

const addGallery = (draft, moduleId, siteId, actualGalleryId = null, title = null) => {
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
      moduleId,
      title,
    };
  }
};

const galleryReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case ADD_GALLERY: {
        const { moduleId, galleryId, title } = payload;
        addGallery(draft, moduleId, galleryId, null, title);

        break;
      }
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        // Add default module galleries for all modules
        modules.forEach(({ id, title }) => {
          const moduleId = generateModuleId(id);
          addGallery(draft, moduleId, DEFAULT_GALLERY_ID, null, title);
          addGallery(draft, moduleId, SEARCH_GALLERY_ID, null, 'Search Results');
        });

        // Add file system default module galleries
        addGallery(draft, FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID, null, 'Local Files');
        addGallery(draft, FILE_SYSTEM_MODULE_ID, SEARCH_GALLERY_ID, null, 'Local Files');
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
        };

        // add items
        draft.byId[galleryId].items = [
          ...draft.byId[galleryId].items,
          ...items
            .filter(({ url, width, height }) => url && width && height)
            .map(({ id }) => generateItemId(galleryId, id)),
        ];

        // update async state
        handleAsyncSuccess(state.byId[galleryId], draft.byId[galleryId]);
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
        const galleryId = meta;
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]); // make sure nothing tries to fetch gallery until saga says go
        draft.byId[galleryId].searchQuery = searchQuery;
        break;
      }
      case UPDATE_SORT: {
        const galleryId = meta;
        const valueId = payload;
        draft.byId[galleryId].currentSort = valueId;
        break;
      }
      case UPDATE_FILTER: {
        const galleryId = meta;
        const filterId = payload;
        draft.byId[galleryId].currentFilter = filterId;
        break;
      }
      case CLEAR_GALLERY: {
        const galleryId = payload;
        const gallery = state.byId[galleryId];
        draft.byId[galleryId] = {
          ...gallery,
          ...initialAsyncState,
          offset: 0,
          count: 0,
          after: null,
          hasNext: true,
          items: [],
        };

        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default galleryReducer;
