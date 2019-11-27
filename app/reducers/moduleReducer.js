import produce from 'immer';
import uuidv3 from 'uuid/v3';
import uuidv4 from 'uuid/v4';

import { initialAsyncState, handleAsyncFetch, handleAsyncError, handleAsyncSuccess } from './asyncActionReducer';
import {
  FETCH_MODULES,
  FETCH_MODULES_SUCCESS,
  FETCH_MODULES_ERROR,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  CLEAR_GALLERY,
  ADD_MODULE,
  REMOVE_MODULE,
  UPDATE_MODULE,
  ADD_GALLERY,
  REMOVE_GALLERY,
  UPDATE_GALLERY,
  ADD_IMAGE,
  REMOVE_IMAGE,
  UPDATE_IMAGE,
} from '../actions/types';

// uuid namespaces
const MODULES_NAMESPACE = uuidv4();
const DEFAULT_GALLERY_ID = uuidv4();
const SEARCH_GALLERY_ID = uuidv4();
const MODULE_GALLERY_NAMESPACE = uuidv4();
const GALLERIES_NAMESPACE = uuidv4();
const GALLERY_IMAGE_NAMESPACE = uuidv4();
const IMAGES_NAMESPACE = uuidv4();

export const initialState = {
  modules: {
    byId: {},
    allIds: [],
    ...initialAsyncState,
  },
  galleries: { byId: {}, allIds: [] },
  moduleGallery: { byId: {}, allIds: [] },
  items: { byId: {}, allIds: [] },
  galleryItem: { byId: {}, allIds: [] },
};

export const initialItemState = {
  id: null,
  siteId: null,
  title: null,
  description: null,
  width: 0,
  height: 0,
  isVideo: false,
  isGallery: false,
  imageURL: null,
  videoURL: null,
  thumbURL: null,
};

export const initialModuleState = {
  id: null,
  siteId: null,
  title: null,
  description: null,
  authType: null,
  icon: null,
  initialOffset: 0,
  defaultGalleryId: null,
  searchGalleryId: null,
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

const addGallery = (state, draft, moduleId, gallery) => {
  // generate ids
  const moduleGalleryId = uuidv3(moduleId + gallery.id, MODULE_GALLERY_NAMESPACE);
  const galleryId = uuidv3(moduleGalleryId, GALLERIES_NAMESPACE);

  // add to moduleGallery
  draft.moduleGallery.allIds.push(moduleGalleryId);
  draft.moduleGallery.byId[moduleGalleryId] = {
    id: moduleGalleryId,
    moduleId,
    galleryId,
  };

  // add to galleries
  draft.galleries.allIds.push(galleryId);
  draft.galleries.byId[galleryId] = {
    ...initialGalleryState,
    ...gallery,
    siteId: gallery.id,
    id: galleryId,
  };

  return moduleGalleryId;
};

const removeItem = (state, draft, galleryItemId) => {
  // lookup galleryItem
  const galleryItem = state.galleryItem.byId[galleryItemId];

  // remove from galleryItem
  delete draft.galleryItem.byId[galleryItemId];
  draft.galleryItem.allIds = draft.galleryItem.allIds.filter(id => id !== galleryItemId);

  // remove from items
  delete draft.items.byId[galleryItem.itemId];
  draft.items.allIds = draft.items.allIds.filter(id => id !== galleryItem.itemId);
};

const removeGallery = (state, draft, moduleGalleryId) => {
  // lookup moduleGallery by id
  const moduleGallery = state.moduleGallery.byId[moduleGalleryId];

  // delete from moduleGallery
  delete draft.moduleGallery.byId[moduleGalleryId];
  draft.moduleGallery.allIds = draft.moduleGallery.allIds.filter(id => id !== moduleGalleryId);

  // delete from galleries
  delete draft.galleries.byId[moduleGallery.galleryId];
  draft.galleries.allIds = draft.galleries.allIds.filter(id => id !== moduleGallery.galleryId);

  // collect all gallery items
  const galleryItems = state.galleryItem.allIds.filter(id => state.galleryItem.byId[id] === moduleGallery.galleryId);

  // remove all gallery items, and items related to the cleared gallery
  galleryItems.forEach(galleryItemId => removeItem(state, draft, galleryItemId));
};

const moduleReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};

    switch (type) {
      case FETCH_MODULES: {
        handleAsyncFetch(state, draft);
        break;
      }
      case FETCH_MODULES_SUCCESS: {
        handleAsyncSuccess(state, draft);
        break;
      }
      case FETCH_MODULES_ERROR: {
        handleAsyncError(state, draft);
        break;
      }
      case ADD_MODULE: {
        const module = payload;

        // generate id
        const moduleId = uuidv3(module.id, MODULES_NAMESPACE);

        // add to modules
        draft.modules.allIds.push(moduleId);
        draft.modules.byId[moduleId] = {
          ...module,
          siteId: module.id,
          id: moduleId,
        };

        // Add default gallery
        draft.modules.byId[moduleId].defaultGalleryId = addGallery(state, draft, moduleId, { id: DEFAULT_GALLERY_ID });

        // Add search gallery
        draft.modules.byId[moduleId].searchGalleryId = addGallery(state, draft, moduleId, { id: SEARCH_GALLERY_ID });

        break;
      }
      case REMOVE_MODULE: {
        const moduleId = payload;

        // delete from modules
        delete draft.modules.byId[moduleId];
        draft.modules.allIds = draft.modules.allIds.filter(id => id !== moduleId);

        // get modules galleries
        const moduleGalleries = state.moduleGallery.allIds.filter(
          id => state.moduleGallery.byId[id].moduleId === moduleId
        );

        // delete module galleries
        moduleGalleries.forEach(moduleGalleryId => removeGallery(state, draft, moduleGalleryId));

        break;
      }
      case UPDATE_MODULE: {
        const { moduleId } = meta;
        const module = payload;

        // update gallery
        draft.modules.byId[moduleId] = {
          ...draft.modules.byId[moduleId],
          ...module,
        };

        break;
      }
      case FETCH_GALLERY: {
        const galleryId = payload;
        handleAsyncFetch(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = payload;
        handleAsyncSuccess(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_ERROR: {
        const galleryId = payload;
        handleAsyncError(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        break;
      }
      case CLEAR_GALLERY: {
        const { moduleId, galleryId } = meta;
        const moduleGalleryId = state.moduleGallery.allIds.find(
          id =>
            state.moduleGallery.byId[id].moduleId === moduleId && state.moduleGallery.byId[id].galleryId === galleryId
        );

        removeGallery(state, draft, moduleGalleryId);
        addGallery(state, draft, moduleId, galleryId);
        break;
      }
      case ADD_GALLERY: {
        const { moduleId } = meta;
        const gallery = payload;
        addGallery(state, draft, moduleId, gallery);
        break;
      }
      case REMOVE_GALLERY: {
        const { moduleGalleryId } = meta;
        removeGallery(state, draft, moduleGalleryId);
        break;
      }
      case UPDATE_GALLERY: {
        const { moduleGalleryId } = meta;
        const gallery = payload;

        // get gallery id
        const moduleGallery = state.moduleGallery.byId[moduleGalleryId];
        const { galleryId } = moduleGallery;

        // update gallery
        draft.galleries.byId[galleryId] = {
          ...draft.galleries.byId[galleryId],
          ...gallery,
        };

        break;
      }
      case ADD_IMAGE: {
        const galleryId = meta;
        const item = payload;

        // generate ids
        const galleryItemId = uuidv3(galleryId + item.id, GALLERY_IMAGE_NAMESPACE);
        const itemId = uuidv3(galleryItemId, IMAGES_NAMESPACE);

        // Add galleryItem
        state.galleryItem.allIds.push(galleryItemId);
        state.galleryItem.byId[galleryItemId] = {
          id: galleryItemId,
          itemId,
          galleryId,
        };

        // Add item
        state.items.allIds.push(itemId);
        state.items.byId[itemId] = {
          ...item,
          siteId: item.id,
          id: itemId,
        };

        break;
      }
      case REMOVE_IMAGE: {
        const galleryItemId = meta;
        removeItem(state, draft, galleryItemId);
        break;
      }
      case UPDATE_IMAGE: {
        const galleryItemId = meta;
        const item = payload;

        // get gallery id
        const galleryItem = state.galleryItem.byId[galleryItemId];
        const { itemId } = galleryItem;

        // update gallery
        draft.items.byId[itemId] = {
          ...draft.items.byId[itemId],
          ...item,
        };

        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default moduleReducer;
