import produce from 'immer';
import { basename } from 'path';

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
} from './constants';

import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  UPDATE_SEARCH,
  UPDATE_SORT,
  FETCH_MODULES_SUCCESS,
  UPDATE_FILTER,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
  SET_FILE_SYSTEM_DIRECTORY,
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
  savedScrollPosition: 0,
  ...initialAsyncState,
};

const addGallery = (draft, moduleId, gallerySiteId, title, parentId) => {
  // generate ids
  const galleryId = generateGalleryId(moduleId, gallerySiteId);

  // if gallery does not exist
  if (!(galleryId in draft.byId)) {
    // add gallery
    draft.allIds.push(galleryId);
    draft.byId[galleryId] = {
      ...initialGalleryState,
      siteId: gallerySiteId,
      id: galleryId,
      moduleId,
      title,
      parentId,
    };
  }
};

const galleryReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        // Add default module galleries for all modules
        modules.forEach(({ id, title }) => {
          const moduleId = generateModuleId(id);
          addGallery(draft, moduleId, DEFAULT_GALLERY_ID, title);
        });

        // Add file system default module galleries
        addGallery(draft, FILE_SYSTEM_MODULE_ID, DEFAULT_GALLERY_ID, 'Local Files');
        break;
      }
      case FETCH_GALLERY: {
        const galleryId = meta;
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = meta;
        const gallery = payload;
        const { items, ...galleryState } = gallery;
        const { moduleId } = draft.byId[galleryId];

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
            .filter(({ url, width, height }) => url && width && height) // Remove any poorly formatted items
            .map(({ id }) => generateItemId(galleryId, id)),
        ];

        // Remove duplicates (if any)
        draft.byId[galleryId].items = draft.byId[galleryId].items.filter(
          (id, idx) => draft.byId[galleryId].items.indexOf(id) === idx
        );

        // go through any items
        // for any items that are themselves galleries, add them
        items
          .filter(({ isGallery }) => isGallery)
          .forEach(({ id, title }) => addGallery(draft, moduleId, id, title, galleryId));

        // update async state
        handleAsyncSuccess(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_FAILURE: {
        const error = payload;
        const galleryId = meta;
        handleAsyncError(state.byId[galleryId], draft.byId[galleryId], error);
        break;
      }
      case UPDATE_SEARCH: {
        const searchQuery = payload;
        const galleryId = meta;

        // set searchQuery
        draft.byId[galleryId].searchQuery = searchQuery;

        // mark as fetching
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case UPDATE_SORT: {
        const galleryId = meta;
        const valueId = payload;

        // set sort value
        draft.byId[galleryId].currentSort = valueId;

        // mark as fetching
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case UPDATE_FILTER: {
        const galleryId = meta;
        const filterId = payload;

        // set filter value
        draft.byId[galleryId].currentFilter = filterId;

        // mark as fetching
        handleAsyncFetch(state.byId[galleryId], draft.byId[galleryId]);
        break;
      }
      case CLEAR_GALLERY: {
        const galleryId = meta;

        // clear gallery
        draft.byId[galleryId].items = [];
        draft.byId[galleryId].offset = 0;
        draft.byId[galleryId].count = 0;
        draft.byId[galleryId].after = null;
        draft.byId[galleryId].hasNext = true;
        draft.byId[galleryId].savedScrollPosition = 0;
        draft.byId[galleryId].fetched = false;

        break;
      }
      case SAVE_SCROLL_POSITION: {
        const galleryId = meta;
        const scrollPosition = payload;
        draft.byId[galleryId].savedScrollPosition = scrollPosition;
        break;
      }
      case SET_FILE_SYSTEM_DIRECTORY: {
        const directoryPath = payload;
        const siteId = Buffer.from(directoryPath, 'utf-8').toString('base64');

        addGallery(draft, FILE_SYSTEM_MODULE_ID, siteId, basename(directoryPath));
        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default galleryReducer;
