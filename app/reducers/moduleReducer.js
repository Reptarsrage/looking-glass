import produce from 'immer';
import uuidv3 from 'uuid/v3';

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

// namespace uuid constants
export const MODULES_NAMESPACE = '124f5b23-53e1-4258-9f17-0eaa1b9bf86f';
export const DEFAULT_GALLERY_ID = '8d8ba67e-bbad-4908-9ce2-e55e9add872d';
export const SEARCH_GALLERY_ID = '766e634b-9815-4098-8562-315bb37786ac';
export const MODULE_GALLERY_NAMESPACE = '357757cf-6140-4439-b2ee-08c7f31ecfb4';
export const GALLERIES_NAMESPACE = '0e20817f-1e71-4afb-b107-e215cc7d29d0';
export const GALLERY_IMAGE_NAMESPACE = '2e26db14-58ab-4060-812e-5fae4cc4fd87';
export const IMAGES_NAMESPACE = '05948023-6791-4837-96f4-ceff6416b3e3';

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

  // get module
  const module = state.modules.byId[moduleId];

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
    offset: module.initialOffset,
  };

  return galleryId;
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
        handleAsyncFetch(state.modules, draft.modules);
        break;
      }
      case FETCH_MODULES_SUCCESS: {
        handleAsyncSuccess(state.modules, draft.modules);
        break;
      }
      case FETCH_MODULES_ERROR: {
        handleAsyncError(state.modules, draft.modules);
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
        const moduleId = meta;
        const module = payload;

        // update gallery
        draft.modules.byId[moduleId] = {
          ...state.modules.byId[moduleId],
          ...module,
        };

        break;
      }
      case FETCH_GALLERY: {
        const { galleryId } = payload;
        handleAsyncFetch(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_SUCCESS: {
        const galleryId = payload;
        handleAsyncSuccess(state.galleries.byId[galleryId], draft.galleries.byId[galleryId]);
        break;
      }
      case FETCH_GALLERY_ERROR: {
        const error = payload;
        const galleryId = meta;
        handleAsyncError(state.galleries.byId[galleryId], draft.galleries.byId[galleryId], error);
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
        const galleryId = meta;
        const gallery = payload;

        // update gallery
        draft.galleries.byId[galleryId] = {
          ...state.galleries.byId[galleryId],
          ...gallery,
          id: state.galleries.byId[galleryId].id,
          siteId: state.galleries.byId[galleryId].siteId,
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
        draft.galleryItem.allIds.push(galleryItemId);
        draft.galleryItem.byId[galleryItemId] = {
          id: galleryItemId,
          itemId,
          galleryId,
        };

        // Add item
        draft.items.allIds.push(itemId);
        draft.items.byId[itemId] = {
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
        const itemId = meta;
        const item = payload;

        // update gallery
        draft.items.byId[itemId] = {
          ...state.items.byId[itemId],
          ...item,
        };

        break;
      }
      default:
        break; // Nothing to do
    }
  });

export default moduleReducer;
